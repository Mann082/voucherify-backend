import { Controller, Post, Body, Param, Put, Delete, UseGuards, Get, BadRequestException } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { RedeemVoucherDto } from './dto/redeem-voucher.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SetMetadata } from '@nestjs/common';
import { RolesGuard } from 'src/campaign/guards/roles.guard';

@Controller('vouchers')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['ADMIN'])
  async create(@Body() createVoucherDto: CreateVoucherDto) {
    return this.voucherService.create(createVoucherDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['ADMIN'])
  async update(@Param('id') id: string, @Body() updateVoucherDto: UpdateVoucherDto) {
    return this.voucherService.update(id, updateVoucherDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['ADMIN'])
  async delete(@Param('id') id: string) {
    return this.voucherService.delete(id);
  }

  @Post('redeem')
  @UseGuards(JwtAuthGuard)
  async redeem(@Body() redeemVoucherDto: RedeemVoucherDto) {
    return this.voucherService.redeem(redeemVoucherDto);
  }

  @Post('best-vouchers')
  async getBestVouchers(@Body('amount') amount: number) {
    return this.voucherService.getBestVouchers(amount);
  }

}
