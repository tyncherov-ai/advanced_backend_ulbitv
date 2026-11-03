import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { JwtAuthGuard, JwtPayload } from '../auth/jwt-auth.guard';
import { imageUploadOptions } from '../files/image-upload.options';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  createPost(
    @Body() dto: CreatePostDto,
    @UploadedFile() image: Express.Multer.File | undefined,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.postsService.createPost(dto, req.user.id, image);
  }

  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts();
  }
}
