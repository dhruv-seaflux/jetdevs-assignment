import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  nickname: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
