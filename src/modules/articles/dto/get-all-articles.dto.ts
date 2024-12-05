import { IsString, IsOptional } from "class-validator";

export class GetAllArticlesDto {
  @IsString()
  @IsOptional()
  page: string;

  @IsString()
  @IsOptional()
  limit: string;
}
