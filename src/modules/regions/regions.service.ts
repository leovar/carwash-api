import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '../../database/firebase.service';
import { Region } from './entities/region.entity';

@Injectable()
export class RegionsService {
  private readonly logger = new Logger(RegionsService.name);
  private readonly collectionName = 'regions';

  constructor(private readonly firebaseService: FirebaseService) {}

  private mapFirestoreToRegion(
    doc: FirebaseFirestore.DocumentSnapshot,
  ): Region {
    const data = doc.data();
    if (!data) {
      throw new Error('Document data is undefined');
    }
    return {
      id: doc.id,
      country: data.country,
      municipalities: data.municipalities || [],
      name: data.name,
    };
  }

  async findAll(): Promise<Region[]> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const snapshot = await firestore.collection(this.collectionName).get();

      const regions: Region[] = [];

      snapshot.forEach((doc) => {
        regions.push(this.mapFirestoreToRegion(doc));
      });

      this.logger.log(`Retrieved ${regions.length} regions`);
      return regions;
    } catch (error) {
      this.logger.error('Failed to retrieve regions', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Region | null> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const doc = await firestore.collection(this.collectionName).doc(id).get();

      if (!doc.exists) {
        this.logger.warn(`Region with ID ${id} not found`);
        return null;
      }

      return this.mapFirestoreToRegion(doc);
    } catch (error) {
      this.logger.error(`Failed to retrieve region with ID ${id}`, error);
      throw error;
    }
  }
}
