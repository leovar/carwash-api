import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  HttpStatus,
  HttpCode,
  UseGuards,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { SubscriptionPlansService } from './subscription-plans.service';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';

@Controller('subscription-plans')
@UseGuards(FirebaseAuthGuard)
export class SubscriptionPlansController {
  constructor(
    private readonly subscriptionPlansService: SubscriptionPlansService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createSubscriptionPlanDto: CreateSubscriptionPlanDto,
  ): Promise<SubscriptionPlan> {
    return this.subscriptionPlansService.create(createSubscriptionPlanDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<SubscriptionPlan[]> {
    return this.subscriptionPlansService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<SubscriptionPlan> {
    const subscriptionPlan = await this.subscriptionPlansService.findOne(id);

    if (!subscriptionPlan) {
      throw new NotFoundException(`Subscription plan with ID ${id} not found`);
    }

    return subscriptionPlan;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateSubscriptionPlanDto: UpdateSubscriptionPlanDto,
  ): Promise<SubscriptionPlan> {
    const subscriptionPlan = await this.subscriptionPlansService.update(
      id,
      updateSubscriptionPlanDto,
    );

    if (!subscriptionPlan) {
      throw new NotFoundException(`Subscription plan with ID ${id} not found`);
    }

    return subscriptionPlan;
  }
}
