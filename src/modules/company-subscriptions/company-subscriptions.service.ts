import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '../../database/firebase.service';
import { CreateCompanySubscriptionDto } from './dto/create-company-subscription.dto';
import { UpdateCompanySubscriptionDto } from './dto/update-company-subscription.dto';
import { CompanySubscription } from './entities/company-subscription.entity';

@Injectable()
export class CompanySubscriptionsService {
  private readonly logger = new Logger(CompanySubscriptionsService.name);
  private readonly collectionName = 'companySubscriptions';

  constructor(private readonly firebaseService: FirebaseService) {}

  private mapFirestoreToCompanySubscription(
    doc: FirebaseFirestore.DocumentSnapshot,
  ): CompanySubscription {
    const data = doc.data();
    if (!data) {
      throw new Error('Document data is undefined');
    }
    return {
      id: doc.id,
      billingCycle: data.billingCycle,
      createdDate: data.createdDate?.toDate() || new Date(),
      endDate: data.endDate?.toDate() || new Date(),
      idCompany: data.idCompany,
      idSubscriptionPlan: data.idSubscriptionPlan,
      isActive: data.isActive,
      licensePeriod: data.licensePeriod,
      price: data.price,
      discount: data.discount,
      vatPercentage: data.vatPercentage,
      vatValue: data.vatValue,
      finalPrice: data.finalPrice,
      startDate: data.startDate?.toDate() || new Date(),
    };
  }

  async create(
    createCompanySubscriptionDto: CreateCompanySubscriptionDto,
  ): Promise<CompanySubscription> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const now = new Date();

      const companySubscriptionData = {
        ...createCompanySubscriptionDto,
        isActive: createCompanySubscriptionDto.isActive ?? true,
        createdDate: now,
      };

      const docRef = await firestore
        .collection(this.collectionName)
        .add(companySubscriptionData);

      this.logger.log(`Company subscription created with ID: ${docRef.id}`);

      return {
        ...companySubscriptionData,
        id: docRef.id,
      };
    } catch (error) {
      this.logger.error('Failed to create company subscription', error);
      throw error;
    }
  }

  async findAll(): Promise<CompanySubscription[]> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const snapshot = await firestore.collection(this.collectionName).get();

      const companySubscriptions: CompanySubscription[] = [];

      snapshot.forEach((doc) => {
        companySubscriptions.push(this.mapFirestoreToCompanySubscription(doc));
      });

      this.logger.log(
        `Retrieved ${companySubscriptions.length} company subscriptions`,
      );
      return companySubscriptions;
    } catch (error) {
      this.logger.error('Failed to retrieve company subscriptions', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<CompanySubscription | null> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const doc = await firestore.collection(this.collectionName).doc(id).get();

      if (!doc.exists) {
        this.logger.warn(`Company subscription with ID ${id} not found`);
        return null;
      }

      return this.mapFirestoreToCompanySubscription(doc);
    } catch (error) {
      this.logger.error(
        `Failed to retrieve company subscription with ID ${id}`,
        error,
      );
      throw error;
    }
  }

  async update(
    id: string,
    updateCompanySubscriptionDto: UpdateCompanySubscriptionDto,
  ): Promise<CompanySubscription | null> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const docRef = firestore.collection(this.collectionName).doc(id);

      const doc = await docRef.get();
      if (!doc.exists) {
        this.logger.warn(
          `Company subscription with ID ${id} not found for update`,
        );
        return null;
      }

      const updateData = {
        ...updateCompanySubscriptionDto,
      };

      await docRef.update(updateData);

      this.logger.log(
        `Company subscription with ID ${id} updated successfully`,
      );

      return await this.findOne(id);
    } catch (error) {
      this.logger.error(
        `Failed to update company subscription with ID ${id}`,
        error,
      );
      throw error;
    }
  }
}
