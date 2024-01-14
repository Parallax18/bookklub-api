import * as firebaseAdmin from 'firebase-admin';
import { Injectable, UploadedFile } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FirebaseService {
  private readonly storage: firebaseAdmin.storage.Storage;

  constructor() {
    if (!firebaseAdmin.apps.length) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const serviceAccount = require('../../V1.json');
      const app = firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount),
        storageBucket: 'gs://bookklub-v0.appspot.com',
      });
      this.storage = app.storage();
    } else {
      this.storage = firebaseAdmin.app().storage();
    }
  }

  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    const { originalname } = file;
    const fileExtension = originalname.split('.').pop();
    const fileName = `${uuid()}.${fileExtension}`;
    const storageRef = this.storage.bucket().file(fileName);

    const stream = storageRef.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    stream.on('error', (err) => {
      console.error(err);
    });

    return new Promise((resolve) => {
      stream.on('finish', async () => {
        const firebaseUrl = `https://storage.googleapis.com/${storageRef.name}/${fileName}`;
        resolve(firebaseUrl);
      });

      stream.end(file.buffer);
    });
  }
}
