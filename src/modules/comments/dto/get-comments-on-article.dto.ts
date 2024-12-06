import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class GetCommentsOnArticleDto {
    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    articleId: number;

}