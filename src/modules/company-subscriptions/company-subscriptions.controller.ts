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
import { CompanySubscriptionsService } from './company-subscriptions.service';
import { CreateCompanySubscriptionDto } from './dto/create-company-subscription.dto';
import { UpdateCompanySubscriptionDto } from './dto/update-company-subscription.dto';
import { CompanySubscription } from './entities/company-subscription.entity';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';

@Controller('company-subscriptions')
@UseGuards(FirebaseAuthGuard)
export class CompanySubscriptionsController {
  constructor(
    private readonly companySubscriptionsService: CompanySubscriptionsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCompanySubscriptionDto: CreateCompanySubscriptionDto,
  ): Promise<CompanySubscription> {
    return this.companySubscriptionsService.create(
      createCompanySubscriptionDto,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<CompanySubscription[]> {
    return this.companySubscriptionsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<CompanySubscription> {
    const companySubscription =
      await this.companySubscriptionsService.findOne(id);

    if (!companySubscription) {
      throw new NotFoundException(
        `Company subscription with ID ${id} not found`,
      );
    }

    return companySubscription;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateCompanySubscriptionDto: UpdateCompanySubscriptionDto,
  ): Promise<CompanySubscription> {
    const companySubscription = await this.companySubscriptionsService.update(
      id,
      updateCompanySubscriptionDto,
    );

    if (!companySubscription) {
      throw new NotFoundException(
        `Company subscription with ID ${id} not found`,
      );
    }

    return companySubscription;
  }
}
