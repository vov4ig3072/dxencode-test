import { InputType, Field, Int } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts'

@InputType()
export class CreateCommentInput {
  @Field()
  @IsNotEmpty()
  text: string

  @Field(() => Int)
  @IsNotEmpty()
  userId: number

  @Field(() => Int, { nullable: true })
  @IsOptional()
  parentId?: number

  @IsOptional()
  @Field(() => GraphQLUpload, { nullable: true })
  image?: Promise<FileUpload>

  @IsOptional()
  @Field(() => GraphQLUpload, { nullable: true })
  textFile?: Promise<FileUpload>
}
