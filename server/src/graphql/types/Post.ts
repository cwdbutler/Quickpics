import { Field, ID, ObjectType } from "type-graphql";
import "reflect-metadata";
import { User } from "./User";

@ObjectType()
export class Post {
  @Field((type) => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  caption?: string;

  @Field((type) => User)
  author: User;
}
