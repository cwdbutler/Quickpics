import { Field, ID, ObjectType } from "type-graphql";
import "reflect-metadata";

@ObjectType()
export class Post {
  @Field((type) => ID)
  id: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  caption?: string;
}
