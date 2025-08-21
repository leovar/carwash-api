import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '../../database/firebase.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);
  private readonly collectionName = 'companies';

  constructor(private readonly firebaseService: FirebaseService) {}

  private mapFirestoreToCompany(
    doc: FirebaseFirestore.DocumentSnapshot,
  ): Company {
    const data = doc.data();
    if (!data) {
      throw new Error('Document data is undefined');
    }
    return {
      id: doc.id,
      address: data.address,
      city: data.city,
      companyCode: data.companyCode,
      companyName: data.companyName,
      contactName: data.contactName,
      country: data.country,
      createdDate: data.createdDate?.toDate() || new Date(),
      description: data.description,
      email: data.email,
      isActive: data.isActive,
      mainCompany: data.mainCompany,
      nit: data.nit,
      phone: data.phone,
      region: data.region,
    };
  }

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const now = new Date();

      const companyData = {
        ...createCompanyDto,
        isActive: createCompanyDto.isActive ?? true,
        createdDate: now,
      };

      const docRef = await firestore
        .collection(this.collectionName)
        .add(companyData);

      this.logger.log(`Company created with ID: ${docRef.id}`);

      return {
        ...companyData,
        id: docRef.id,
      };
    } catch (error) {
      this.logger.error('Failed to create company', error);
      throw error;
    }
  }

  async findAll(): Promise<Company[]> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const snapshot = await firestore.collection(this.collectionName).get();

      const companies: Company[] = [];

      snapshot.forEach((doc) => {
        companies.push(this.mapFirestoreToCompany(doc));
      });

      this.logger.log(`Retrieved ${companies.length} companies`);
      return companies;
    } catch (error) {
      this.logger.error('Failed to retrieve companies', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Company | null> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const doc = await firestore.collection(this.collectionName).doc(id).get();

      if (!doc.exists) {
        this.logger.warn(`Company with ID ${id} not found`);
        return null;
      }

      return this.mapFirestoreToCompany(doc);
    } catch (error) {
      this.logger.error(`Failed to retrieve company with ID ${id}`, error);
      throw error;
    }
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company | null> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const docRef = firestore.collection(this.collectionName).doc(id);

      const doc = await docRef.get();
      if (!doc.exists) {
        this.logger.warn(`Company with ID ${id} not found for update`);
        return null;
      }

      const updateData = {
        ...updateCompanyDto,
      };

      await docRef.update(updateData);

      this.logger.log(`Company with ID ${id} updated successfully`);

      return await this.findOne(id);
    } catch (error) {
      this.logger.error(`Failed to update company with ID ${id}`, error);
      throw error;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const docRef = firestore.collection(this.collectionName).doc(id);

      const doc = await docRef.get();
      if (!doc.exists) {
        this.logger.warn(`Company with ID ${id} not found for deletion`);
        return false;
      }

      await docRef.delete();
      this.logger.log(`Company with ID ${id} deleted successfully`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete company with ID ${id}`, error);
      throw error;
    }
  }
}
