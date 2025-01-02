import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { RedeemVoucherDto } from './dto/redeem-voucher.dto';
import { Voucher } from './schemas/voucher.schema';
import { Redemption } from './schemas/redemption.schema';

@Injectable()
export class VoucherService {
  constructor(
    @InjectModel(Voucher.name) private voucherModel: Model<Voucher>,
    @InjectModel(Redemption.name) private redemptionModel: Model<Redemption>,
  ) {}

  // Create a new voucher
  async create(createVoucherDto: CreateVoucherDto): Promise<Voucher> {
    const voucher = new this.voucherModel(createVoucherDto);
    return voucher.save();
  }

  // Update an existing voucher
  async update(id: string, updateVoucherDto: UpdateVoucherDto): Promise<Voucher> {
    const voucher = await this.voucherModel.findByIdAndUpdate(id, updateVoucherDto, { new: true }).exec();
    if (!voucher) {
      throw new NotFoundException(`Voucher with ID ${id} not found.`);
    }
    return voucher;
  }

  // Delete a voucher
  async delete(id: string): Promise<void> {
    const result = await this.voucherModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Voucher with ID ${id} not found.`);
    }
  }

  // Redeem a voucher by a user
  async redeem(redeemVoucherDto: RedeemVoucherDto): Promise<string> {
    const { code, userId } = redeemVoucherDto;

    // Find the voucher by code
    const voucher = await this.voucherModel.findOne({ code }).exec();
    if (!voucher) {
      throw new NotFoundException(`Voucher with code ${code} not found.`);
    }

    // Check if the voucher is active
    if (voucher.status !== 'ACTIVE') {
      throw new BadRequestException(`Voucher ${code} is not active.`);
    }

    // Check if the voucher has expired
    if (voucher.expirationDate && voucher.expirationDate < new Date()) {
      throw new BadRequestException(`Voucher ${code} has expired.`);
    }

    // Check if the voucher has reached its total usage limit
    if (voucher.currentUsage >= voucher.totalUsages) {
      throw new BadRequestException(`Voucher ${code} has reached its total usage limit.`);
    }

    // Check if the user has already redeemed the voucher
    const redemption = await this.redemptionModel.findOne({ voucherId: voucher._id, userId }).exec();

    if (redemption) {
      // If the user has already redeemed, check if they exceeded max usage per user
      if (redemption.usageCount >= voucher.maxUsagePerUser) {
        throw new BadRequestException(`User has reached the max usage limit for voucher ${code}.`);
      }

      // Increment redemption usage count and update last redeemed time
      redemption.usageCount += 1;
      redemption.lastRedeemedAt = new Date();
      await redemption.save();
    } else {
      // Create a new redemption entry for the user if they haven't redeemed the voucher yet
      const newRedemption = new this.redemptionModel({
        voucherId: voucher._id,
        userId,
        usageCount: 1,
      });
      await newRedemption.save();
    }

    // Increment the voucher's current usage count
    voucher.currentUsage += 1;

    // If the total usage limit is reached, mark the voucher as used
    if (voucher.currentUsage >= voucher.totalUsages) {
      voucher.status = 'USED';
    }

    // Save the updated voucher
    await voucher.save();

    return `Voucher ${code} redeemed successfully.`;
  }

  async getBestVouchers(amount: number) {
    const vouchers = await this.findAllVouchers(); // Fetch active vouchers
    const bestVouchers = [];

    for (const voucher of vouchers) {
      let discountValue = 0;

      if (voucher.type === 'PERCENTAGE') {
        discountValue = (amount * voucher.value) / 100; // Calculate percentage discount
        if (voucher.maxDiscount && discountValue > voucher.maxDiscount) {
          discountValue = voucher.maxDiscount; // Apply max discount limit
        }
      } else {
        discountValue = voucher.value; // For fixed amount vouchers
      }

      if (discountValue > 0) {
        bestVouchers.push({ voucher, discountValue });
      }
    }

    bestVouchers.sort((a, b) => b.discountValue - a.discountValue); // Sort by discount value in descending order
    return bestVouchers;
  }

  async findAllVouchers(): Promise<Voucher[]> {
    return this.voucherModel.find({ status: 'ACTIVE' }).exec(); // Fetch only active vouchers from the database
  }
}
