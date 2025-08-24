import { Module } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { RegionsController } from './regions.controller';
import { FirebaseService } from '../../database/firebase.service';

@Module({
  controllers: [RegionsController],
  providers: [RegionsService, FirebaseService],
  exports: [RegionsService],
})
export class RegionsModule {}
