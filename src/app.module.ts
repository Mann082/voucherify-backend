import { Module } from '@nestjs/common';
import { VoucherModule } from './voucher/voucher.module';
import { UserModule } from './user/user.module';
import { CampaignModule } from './campaign/campaign.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://guptamann108:kTrZe63Dtctb6Rja@cluster0.tnjgtsn.mongodb.net/voucherify?retryWrites=true&w=majority&appName=Cluster0'),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    VoucherModule,
    UserModule,
    CampaignModule,
    AuthModule,
  ],
})
export class AppModule {}
