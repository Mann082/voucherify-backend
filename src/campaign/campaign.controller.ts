import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('campaigns')
@SetMetadata('roles', ['ADMIN'])
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}


  @UseGuards(JwtAuthGuard,RolesGuard)
  @Post()
  async create(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignService.create(createCampaignDto);
  }

  @Get()
  async findAll() {
    return this.campaignService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.campaignService.findOne(id);
  }


  @SetMetadata('roles', ['ADMIN'])
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ) {
    return this.campaignService.update(id, updateCampaignDto);
  }


  @SetMetadata('roles', ['ADMIN'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.campaignService.delete(id);
  }
}
