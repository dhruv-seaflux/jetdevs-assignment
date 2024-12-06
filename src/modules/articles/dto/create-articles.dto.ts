import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class CreateArticleDto {

  @IsNotEmpty()
  @IsString()
  @Length(1, 50, { message: "Nickname must be between 1 and 50 characters." })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: "Nickname can only contain alphanumeric characters and underscores." })
  nickname: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255, { message: "Title must be between 1 and 255 characters." })
  @Matches(/^\S.*\S$/, { message: "Title cannot have leading or trailing spaces." })
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 5000, { message: "Content must be between 10 and 5000 characters." })
  content: string;
}
