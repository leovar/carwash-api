import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '../../database/firebase.service';
import { CreateSubscriptionPlanModuleDto } from './dto/create-subscription-plan-module.dto';
import { UpdateSubscriptionPlanModuleDto } from './dto/update-subscription-plan-module.dto';
import { SubscriptionPlanModule } from './entities/subscription-plan-module.entity';

@Injectable()
export class SubscriptionPlanModulesService {
  private readonly logger = new Logger(SubscriptionPlanModulesService.name);
  private readonly collectionName = 'subscriptionPlanModules';

  constructor(private readonly firebaseService: FirebaseService) {}

  private mapFirestoreToSubscriptionPlanModule(
    doc: FirebaseFirestore.DocumentSnapshot,
  ): SubscriptionPlanModule {
    const data = doc.data();
    if (!data) {
      throw new Error('Document data is undefined');
    }
    return {
      id: doc.id,
      createdDate: data.createdDate?.toDate() || new Date(),
      idAppModule: data.idAppModule,
      idSubscriptionPlan: data.idSubscriptionPlan,
      isUnlimited: data.isUnlimited,
      registersLimit: data.registersLimit,
    };
  }

  async findAll(): Promise<SubscriptionPlanModule[]> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const snapshot = await firestore.collection(this.collectionName).get();

      const subscriptionPlanModules: SubscriptionPlanModule[] = [];

      snapshot.forEach((doc) => {
        subscriptionPlanModules.push(
          this.mapFirestoreToSubscriptionPlanModule(doc),
        );
      });

      this.logger.log(
        `Retrieved ${subscriptionPlanModules.length} subscription plan modules`,
      );
      return subscriptionPlanModules;
    } catch (error) {
      this.logger.error('Failed to retrieve subscription plan modules', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<SubscriptionPlanModule | null> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const doc = await firestore.collection(this.collectionName).doc(id).get();

      if (!doc.exists) {
        this.logger.warn(`Subscription plan module with ID ${id} not found`);
        return null;
      }

      return this.mapFirestoreToSubscriptionPlanModule(doc);
    } catch (error) {
      this.logger.error(
        `Failed to retrieve subscription plan module with ID ${id}`,
        error,
      );
      throw error;
    }
  }

  async create(
    createSubscriptionPlanModuleDto: CreateSubscriptionPlanModuleDto,
  ): Promise<SubscriptionPlanModule> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const now = new Date();

      const subscriptionPlanModuleData = {
        ...createSubscriptionPlanModuleDto,
        createdDate: now,
      };

      const docRef = await firestore
        .collection(this.collectionName)
        .add(subscriptionPlanModuleData);

      this.logger.log(`Subscription plan module created with ID: ${docRef.id}`);

      return {
        ...subscriptionPlanModuleData,
        id: docRef.id,
      };
    } catch (error) {
      this.logger.error('Failed to create subscription plan module', error);
      throw error;
    }
  }

  async update(
    id: string,
    updateSubscriptionPlanModuleDto: UpdateSubscriptionPlanModuleDto,
  ): Promise<SubscriptionPlanModule | null> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const docRef = firestore.collection(this.collectionName).doc(id);

      const doc = await docRef.get();
      if (!doc.exists) {
        this.logger.warn(
          `Subscription plan module with ID ${id} not found for update`,
        );
        return null;
      }

      const updateData = {
        ...updateSubscriptionPlanModuleDto,
      };

      await docRef.update(updateData);

      this.logger.log(
        `Subscription plan module with ID ${id} updated successfully`,
      );

      return await this.findOne(id);
    } catch (error) {
      this.logger.error(
        `Failed to update subscription plan module with ID ${id}`,
        error,
      );
      throw error;
    }
  }
}
