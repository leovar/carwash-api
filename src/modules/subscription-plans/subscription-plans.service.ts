import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '../../database/firebase.service';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';
import { SubscriptionPlan } from './entities/subscription-plan.entity';

@Injectable()
export class SubscriptionPlansService {
  private readonly logger = new Logger(SubscriptionPlansService.name);
  private readonly collectionName = 'subscriptionPlans';

  constructor(private readonly firebaseService: FirebaseService) {}

  private mapFirestoreToSubscriptionPlan(
    doc: FirebaseFirestore.DocumentSnapshot,
  ): SubscriptionPlan {
    const data = doc.data();
    if (!data) {
      throw new Error('Document data is undefined');
    }
    return {
      id: doc.id,
      annualPrice: data.annualPrice,
      country: data.country,
      createdDate: data.createdDate?.toDate() || new Date(),
      description: data.description,
      isActive: data.isActive,
      licensePeriod: data.licensePeriod,
      monthlyPrice: data.monthlyPrice,
      name: data.name,
      nonExpiringLicense: data.nonExpiringLicense,
    };
  }

  async findAll(): Promise<SubscriptionPlan[]> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const snapshot = await firestore.collection(this.collectionName).get();

      const subscriptionPlans: SubscriptionPlan[] = [];

      snapshot.forEach((doc) => {
        subscriptionPlans.push(this.mapFirestoreToSubscriptionPlan(doc));
      });

      this.logger.log(
        `Retrieved ${subscriptionPlans.length} subscription plans`,
      );
      return subscriptionPlans;
    } catch (error) {
      this.logger.error('Failed to retrieve subscription plans', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<SubscriptionPlan | null> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const doc = await firestore.collection(this.collectionName).doc(id).get();

      if (!doc.exists) {
        this.logger.warn(`Subscription plan with ID ${id} not found`);
        return null;
      }

      return this.mapFirestoreToSubscriptionPlan(doc);
    } catch (error) {
      this.logger.error(
        `Failed to retrieve subscription plan with ID ${id}`,
        error,
      );
      throw error;
    }
  }

  async create(
    createSubscriptionPlanDto: CreateSubscriptionPlanDto,
  ): Promise<SubscriptionPlan> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const now = new Date();

      const subscriptionPlanData = {
        ...createSubscriptionPlanDto,
        isActive: createSubscriptionPlanDto.isActive ?? true,
        createdDate: now,
      };

      const docRef = await firestore
        .collection(this.collectionName)
        .add(subscriptionPlanData);

      this.logger.log(`Subscription plan created with ID: ${docRef.id}`);

      return {
        ...subscriptionPlanData,
        id: docRef.id,
      };
    } catch (error) {
      this.logger.error('Failed to create subscription plan', error);
      throw error;
    }
  }

  async update(
    id: string,
    updateSubscriptionPlanDto: UpdateSubscriptionPlanDto,
  ): Promise<SubscriptionPlan | null> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const docRef = firestore.collection(this.collectionName).doc(id);

      const doc = await docRef.get();
      if (!doc.exists) {
        this.logger.warn(
          `Subscription plan with ID ${id} not found for update`,
        );
        return null;
      }

      const updateData = {
        ...updateSubscriptionPlanDto,
      };

      await docRef.update(updateData);

      this.logger.log(`Subscription plan with ID ${id} updated successfully`);

      return await this.findOne(id);
    } catch (error) {
      this.logger.error(
        `Failed to update subscription plan with ID ${id}`,
        error,
      );
      throw error;
    }
  }
}
