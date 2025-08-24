import {
  Controller,
  Get,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AppModuleService } from './app-modules.service';
import { AppModule } from './entities/app-module.entity';
import { FirebaseAuthGuard } from 'src/common/guards/firebase-auth.guard';

@Controller('app-modules')
@UseGuards(FirebaseAuthGuard)
export class AppModulesController {
  constructor(private readonly appModuleService: AppModuleService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<AppModule[]> {
    return this.appModuleService.findAll();
  }
}
