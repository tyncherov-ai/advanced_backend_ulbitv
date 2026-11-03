import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const IMAGE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export const imageUploadOptions: MulterOptions = {
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: (req, file, callback) => {
    if (!IMAGE_EXTENSIONS[file.mimetype]) {
      return callback(
        new BadRequestException('Only jpg, png and webp images are allowed'),
        false,
      );
    }
    callback(null, true);
  },
};
