import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './posts.model';
import { FilesService } from '../files/files.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postRepository: typeof Post,
    private filesService: FilesService,
  ) {}

  async createPost(
    dto: CreatePostDto,
    userId: number,
    image: Express.Multer.File | undefined,
  ) {
    if (!image) {
      throw new BadRequestException('Image is required');
    }

    const fileName = await this.filesService.createFile(image);
    try {
      return await this.postRepository.create({
        ...dto,
        userId,
        image: fileName,
      });
    } catch (e) {
      await this.filesService.removeFile(fileName);
      throw e;
    }
  }
}
