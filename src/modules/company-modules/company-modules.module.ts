import { Module } from '@nestjs/common';
import { CompanyModulesService } from './company-modules.service';
import { CompanyModulesController } from './company-modules.controller';
import { FirebaseService } from '../../database/firebase.service';

@Module({
  controllers: [CompanyModulesController],
  providers: [CompanyModulesService, FirebaseService],
  exports: [CompanyModulesService],
})
export class CompanyModulesModule {}
