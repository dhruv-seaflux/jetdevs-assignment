import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches } from "class-validator";

export class AddArticleCommentDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 50, { message: "Nickname must be between 1 and 50 characters." })
    @Matches(/^[a-zA-Z0-9_]+$/, { message: "Nickname can only contain alphanumeric characters and underscores." })
    nickname: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 500, { message: "Comment must be between 1 and 500 characters." })
    @Matches(/^\S.*\S$/, { message: "Comment cannot have leading or trailing spaces." })
    comment: string;

    @IsNumber()
    @IsNotEmpty()
    articleId: number;

    @IsNumber()
    @IsOptional()
    parentCommentId?: number;
}
