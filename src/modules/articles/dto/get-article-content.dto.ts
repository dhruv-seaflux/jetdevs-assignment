import { IsNotEmpty, IsNumber } from "class-validator";
import { Transform } from "class-transformer";

export class GetArticleContentDto {
    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    articleId: number;

}