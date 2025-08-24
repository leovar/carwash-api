import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '../../database/firebase.service';
import { CreateCompanyModuleDto } from './dto/create-company-module.dto';
import { UpdateCompanyModuleDto } from './dto/update-company-module.dto';
import { CompanyModule } from './entities/company-module.entity';

@Injectable()
export class CompanyModulesService {
  private readonly logger = new Logger(CompanyModulesService.name);
  private readonly collectionName = 'companyModules';

  constructor(private readonly firebaseService: FirebaseService) {}

  private mapFirestoreToCompanyModule(
    doc: FirebaseFirestore.DocumentSnapshot,
  ): CompanyModule {
    const data = doc.data();
    if (!data) {
      throw new Error('Document data is undefined');
    }
    return {
      id: doc.id,
      additionalModulePrice: data.additionalModulePrice,
      createdDate: data.createdDate?.toDate() || new Date(),
      idAppModule: data.idAppModule,
      idCompany: data.idCompany,
      isActive: data.isActive,
      isAdditionalModule: data.isAdditionalModule,
      isUnlimitedRegisters: data.isUnlimitedRegisters,
      registersLimitCompany: data.registersLimitCompany,
      registersLimitPlan: data.registersLimitPlan,
    };
  }

  async create(
    createCompanyModuleDto: CreateCompanyModuleDto,
  ): Promise<CompanyModule> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const now = new Date();

      const companyModuleData = {
        ...createCompanyModuleDto,
        isActive: createCompanyModuleDto.isActive ?? true,
        createdDate: now,
      };

      const docRef = await firestore
        .collection(this.collectionName)
        .add(companyModuleData);

      this.logger.log(`Company module created with ID: ${docRef.id}`);

      return {
        ...companyModuleData,
        id: docRef.id,
      };
    } catch (error) {
      this.logger.error('Failed to create company module', error);
      throw error;
    }
  }

  async findAll(): Promise<CompanyModule[]> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const snapshot = await firestore.collection(this.collectionName).get();

      const companyModules: CompanyModule[] = [];

      snapshot.forEach((doc) => {
        companyModules.push(this.mapFirestoreToCompanyModule(doc));
      });

      this.logger.log(`Retrieved ${companyModules.length} company modules`);
      return companyModules;
    } catch (error) {
      this.logger.error('Failed to retrieve company modules', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<CompanyModule | null> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const doc = await firestore.collection(this.collectionName).doc(id).get();

      if (!doc.exists) {
        this.logger.warn(`Company module with ID ${id} not found`);
        return null;
      }

      return this.mapFirestoreToCompanyModule(doc);
    } catch (error) {
      this.logger.error(
        `Failed to retrieve company module with ID ${id}`,
        error,
      );
      throw error;
    }
  }

  async update(
    id: string,
    updateCompanyModuleDto: UpdateCompanyModuleDto,
  ): Promise<CompanyModule | null> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const docRef = firestore.collection(this.collectionName).doc(id);

      const doc = await docRef.get();
      if (!doc.exists) {
        this.logger.warn(`Company module with ID ${id} not found for update`);
        return null;
      }

      const updateData = {
        ...updateCompanyModuleDto,
      };

      await docRef.update(updateData);

      this.logger.log(`Company module with ID ${id} updated successfully`);

      return await this.findOne(id);
    } catch (error) {
      this.logger.error(`Failed to update company module with ID ${id}`, error);
      throw error;
    }
  }
}
