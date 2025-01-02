import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';
import { Voucher, VoucherSchema } from './schemas/voucher.schema';
import { Redemption, RedemptionSchema } from './schemas/redemption.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Voucher.name, schema: VoucherSchema },
      { name: Redemption.name, schema: RedemptionSchema },
    ]),
  ],
  controllers: [VoucherController],
  providers: [VoucherService],
  exports: [VoucherService],
})
export class VoucherModule {}
