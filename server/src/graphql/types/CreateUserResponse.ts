import { Field, ObjectType } from "type-graphql";
import { FieldError } from "./FieldError";
import { User } from "./User";

@ObjectType()
export class CreateUserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
