import { IsString, IsNotEmpty } from 'class-validator';

export class AiQueryDto {
  @IsString()
  @IsNotEmpty({ message: 'Query is required' })
  query: string;
}
