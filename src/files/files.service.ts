import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as uuid from 'uuid';
import { IMAGE_EXTENSIONS } from './image-upload.options';

const STATIC_DIR = path.resolve(process.cwd(), 'static');

@Injectable()
export class FilesService {
  async createFile(file: Express.Multer.File): Promise<string> {
    try {
      // Extension comes from the checked mimetype, not from the client's file name
      const fileName = uuid.v4() + IMAGE_EXTENSIONS[file.mimetype];
      await fs.mkdir(STATIC_DIR, { recursive: true });
      await fs.writeFile(path.join(STATIC_DIR, fileName), file.buffer);
      return fileName;
    } catch {
      throw new HttpException(
        'Failed to create file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeFile(fileName: string): Promise<void> {
    await fs.rm(path.join(STATIC_DIR, fileName), { force: true });
  }
}
