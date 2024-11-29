import { InputType, Field } from '@nestjs/graphql'
import { IsEmailUnique } from '../../common/decorators/is-unique.decorator'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
  IsUrl,
} from 'class-validator'

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty()
  username: string

  @Field()
  @IsEmailUnique()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @Field()
  @IsNotEmpty()
  @IsStrongPassword({ minLength: 6 })
  password: string

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  homepage?: string
}
