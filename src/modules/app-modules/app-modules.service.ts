import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from 'src/database/firebase.service';
import { AppModule } from './entities/app-module.entity';

@Injectable()
export class AppModuleService {
  private readonly logger = new Logger(AppModuleService.name);
  private readonly collectionName = 'appModules';

  constructor(private readonly firebaseService: FirebaseService) {}

  private mapFirestoreToAppModule(
    doc: FirebaseFirestore.DocumentSnapshot,
  ): AppModule {
    const data = doc.data();
    if (!data) {
      throw new Error('Document data is undefined');
    }
    return {
      id: doc.id,
      apiName: data.apiName,
      createdDate: data.createdDate?.toDate() || new Date(),
      description: data.description,
      isActive: data.isActive,
      name: data.name,
    };
  }

  async findAll(): Promise<AppModule[]> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const snapshot = await firestore.collection(this.collectionName).get();

      const appModules: AppModule[] = [];

      snapshot.forEach((doc) => {
        appModules.push(this.mapFirestoreToAppModule(doc));
      });

      this.logger.log(`Retrieved ${appModules.length} app modules`);
      return appModules;
    } catch (error) {
      this.logger.error('Failed to retrieve app modules', error);
      throw error;
    }
  }
}
