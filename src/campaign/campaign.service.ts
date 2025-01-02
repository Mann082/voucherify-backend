import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign } from './schemas/campaign.schema';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel(Campaign.name) private readonly campaignModel: Model<Campaign>,
  ) {}

  async create(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    const campaign = new this.campaignModel(createCampaignDto);
    return campaign.save();
  }

  async findAll(): Promise<Campaign[]> {
    return this.campaignModel.find().populate('vouchers').exec();
  }

  async findOne(id: string): Promise<Campaign> {
    const campaign = await this.campaignModel.findById(id).populate('vouchers');
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }
    return campaign;
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto): Promise<Campaign> {
    const updatedCampaign = await this.campaignModel
      .findByIdAndUpdate(id, updateCampaignDto, { new: true })
      .populate('vouchers');
    if (!updatedCampaign) {
      throw new NotFoundException('Campaign not found');
    }
    return updatedCampaign;
  }

  async delete(id: string): Promise<void> {
    const result = await this.campaignModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Campaign not found');
    }
  }
}
