import { Module } from '@nestjs/common';
import { AppModuleService } from './app-modules.service';
import { AppModulesController } from './app-modules.controller';
import { FirebaseService } from 'src/database/firebase.service';

@Module({
  controllers: [AppModulesController],
  providers: [AppModuleService, FirebaseService],
  exports: [AppModuleService],
})
export class AppModuleModule {}
