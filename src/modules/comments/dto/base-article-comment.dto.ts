import { IsNotEmpty, IsString } from "class-validator";

// Base class for shared validation logic
export class BaseArticleCommentDto {

    @IsString()
    @IsNotEmpty()
    nickname: string;

    @IsString()
    @IsNotEmpty()
    comment: string;
}
