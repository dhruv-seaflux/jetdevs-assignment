import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { BaseArticleCommentDto } from "./base-article-comment.dto";

export class ReplyArticleCommentDto extends BaseArticleCommentDto {
    @IsNumber()
    @IsOptional()
    articleId: number;

    @IsNumber()
    @IsNotEmpty()
    parentCommentId: number; // parentCommentId is required for replies
}
