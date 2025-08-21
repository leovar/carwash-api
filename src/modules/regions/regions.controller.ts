import {
  Controller,
  Get,
  Param,
  HttpStatus,
  HttpCode,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { RegionsService } from './regions.service';
import { Region } from './entities/region.entity';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';

@Controller('regions')
@UseGuards(FirebaseAuthGuard)
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Region[]> {
    return this.regionsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<Region> {
    const region = await this.regionsService.findOne(id);

    if (!region) {
      throw new NotFoundException(`Region with ID ${id} not found`);
    }

    return region;
  }
}