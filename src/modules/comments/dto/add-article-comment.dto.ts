import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AddArticleCommentDto {
    @IsString()
    @IsNotEmpty()
    nickname: string;

    @IsString()
    @IsNotEmpty()
    comment: string;

    @IsNumber()
    @IsNotEmpty()
    articleId: number;

    @IsNumber()
    @IsOptional()
    parentCommentId?: number;
}
