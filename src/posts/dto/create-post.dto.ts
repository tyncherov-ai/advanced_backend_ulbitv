import { IsString } from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'title must be a string' })
  readonly title!: string;

  @IsString({ message: 'content must be a string' })
  readonly content!: string;
}
