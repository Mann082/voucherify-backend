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

    if (voucher.status !== 'ACTIVE') {
      throw new BadRequestException(`Voucher ${code} is not active.`);
    }

    if (voucher.expirationDate && voucher.expirationDate < new Date()) {
      throw new BadRequestException(`Voucher ${code} has expired.`);
    }

    if (voucher.currentUsage >= voucher.totalUsages) {
      throw new BadRequestException(`Voucher ${code} has reached its total usage limit.`);
    }

    const redemption = await this.redemptionModel.findOne({ voucherId: voucher._id, userId }).exec();

    if (redemption) {
      if (redemption.usageCount >= voucher.maxUsagePerUser) {
        throw new BadRequestException(`User has reached the max usage limit for voucher ${code}.`);
      }

      redemption.usageCount += 1;
      redemption.lastRedeemedAt = new Date();
      await redemption.save();
    } else {
      const newRedemption = new this.redemptionModel({
        voucherId: voucher._id,
        userId,
        usageCount: 1,
      });
      await newRedemption.save();
    }

    voucher.currentUsage += 1;

    if (voucher.currentUsage >= voucher.totalUsages) {
      voucher.status = 'USED';
    }

    // Save the updated voucher
    await voucher.save();

    return `Voucher ${code} redeemed successfully.`;
  }

  async getBestVouchers(amount: number) {
    const vouchers = await this.findAllVouchers();
    const bestVouchers = [];

    for (const voucher of vouchers) {
      let discountValue = 0;

      if (voucher.type === 'PERCENTAGE') {
        discountValue = (amount * voucher.value) / 100; 
        if (voucher.maxDiscount && discountValue > voucher.maxDiscount) {
          discountValue = voucher.maxDiscount; 
        }
      } else {
        discountValue = voucher.value;
      }

      if (discountValue > 0) {
        bestVouchers.push({ voucher, discountValue });
      }
    }

    bestVouchers.sort((a, b) => b.discountValue - a.discountValue); 
    return bestVouchers;
  }

  async findAllVouchers(): Promise<Voucher[]> {
    return this.voucherModel.find({ status: 'ACTIVE' }).exec(); 
  }
}
