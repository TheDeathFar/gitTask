import { IsNotEmpty } from 'class-validator';

export class JwtDto {
  @IsNotEmpty()
  access_token: string;
}
