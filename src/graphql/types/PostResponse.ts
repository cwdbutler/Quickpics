import { Field, ObjectType } from "type-graphql";
import { FieldError } from "./FieldError";
import { Post } from "./Post";

@ObjectType()
export class PostResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Post, { nullable: true })
  post?: Post;
}
