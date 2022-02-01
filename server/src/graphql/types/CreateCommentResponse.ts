import { Field, ObjectType } from "type-graphql";
import { FieldError } from "./FieldError";
import { Comment } from "./Comment";

@ObjectType()
export class CreateCommentResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Comment, { nullable: true })
  comment?: Comment;
}
