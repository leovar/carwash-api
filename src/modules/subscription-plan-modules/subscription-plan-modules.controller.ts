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
import { SubscriptionPlanModulesService } from './subscription-plan-modules.service';
import { CreateSubscriptionPlanModuleDto } from './dto/create-subscription-plan-module.dto';
import { UpdateSubscriptionPlanModuleDto } from './dto/update-subscription-plan-module.dto';
import { SubscriptionPlanModule } from './entities/subscription-plan-module.entity';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';

@Controller('subscription-plan-modules')
@UseGuards(FirebaseAuthGuard)
export class SubscriptionPlanModulesController {
  constructor(
    private readonly subscriptionPlanModulesService: SubscriptionPlanModulesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createSubscriptionPlanModuleDto: CreateSubscriptionPlanModuleDto,
  ): Promise<SubscriptionPlanModule> {
    return this.subscriptionPlanModulesService.create(
      createSubscriptionPlanModuleDto,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<SubscriptionPlanModule[]> {
    return this.subscriptionPlanModulesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<SubscriptionPlanModule> {
    const subscriptionPlanModule =
      await this.subscriptionPlanModulesService.findOne(id);

    if (!subscriptionPlanModule) {
      throw new NotFoundException(
        `Subscription plan module with ID ${id} not found`,
      );
    }

    return subscriptionPlanModule;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateSubscriptionPlanModuleDto: UpdateSubscriptionPlanModuleDto,
  ): Promise<SubscriptionPlanModule> {
    const subscriptionPlanModule =
      await this.subscriptionPlanModulesService.update(
        id,
        updateSubscriptionPlanModuleDto,
      );

    if (!subscriptionPlanModule) {
      throw new NotFoundException(
        `Subscription plan module with ID ${id} not found`,
      );
    }

    return subscriptionPlanModule;
  }
}
