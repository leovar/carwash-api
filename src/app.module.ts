import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { RegionsModule } from './modules/regions/regions.module';
import { SubscriptionPlansModule } from './modules/subscription-plans/subscription-plans.module';
import { SubscriptionPlanModulesModule } from './modules/subscription-plan-modules/subscription-plan-modules.module';
import { CompanySubscriptionsModule } from './modules/company-subscriptions/company-subscriptions.module';
import { CompanyModulesModule } from './modules/company-modules/company-modules.module';
import { AppModuleModule } from './modules/app-modules/app-modules.module';
import { FirebaseService } from './database/firebase.service';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    InvoicesModule,
    CompaniesModule,
    RegionsModule,
    SubscriptionPlansModule,
    SubscriptionPlanModulesModule,
    CompanySubscriptionsModule,
    CompanyModulesModule,
    AppModuleModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseService],
})
export class AppModule {}
