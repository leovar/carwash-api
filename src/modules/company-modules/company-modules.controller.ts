import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
  HttpCode,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CompanyModulesService } from './company-modules.service';
import { CreateCompanyModuleDto } from './dto/create-company-module.dto';
import { UpdateCompanyModuleDto } from './dto/update-company-module.dto';
import { CompanyModule } from './entities/company-module.entity';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';

@Controller('company-modules')
@UseGuards(FirebaseAuthGuard)
export class CompanyModulesController {
  constructor(private readonly companyModulesService: CompanyModulesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCompanyModuleDto: CreateCompanyModuleDto,
  ): Promise<CompanyModule> {
    return this.companyModulesService.create(createCompanyModuleDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<CompanyModule[]> {
    return this.companyModulesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<CompanyModule> {
    const companyModule = await this.companyModulesService.findOne(id);

    if (!companyModule) {
      throw new NotFoundException(`Company module with ID ${id} not found`);
    }

    return companyModule;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateCompanyModuleDto: UpdateCompanyModuleDto,
  ): Promise<CompanyModule> {
    const companyModule = await this.companyModulesService.update(
      id,
      updateCompanyModuleDto,
    );

    if (!companyModule) {
      throw new NotFoundException(`Company module with ID ${id} not found`);
    }

    return companyModule;
  }
}
