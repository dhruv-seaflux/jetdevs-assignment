import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { BaseArticleCommentDto } from "./base-article-comment.dto";

export class AddArticleCommentDto extends BaseArticleCommentDto {
    @IsNumber()
    @IsNotEmpty()
    articleId: number;

    @IsNumber()
    @IsOptional()
    parentCommentId?: number;
}
