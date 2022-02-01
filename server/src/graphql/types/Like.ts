import { Field, ID, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
export class Like {
  @Field((type) => ID)
  id: number;

  @Field()
  likedAt: Date;

  @Field()
  entityId: string;

  @Field((type) => User)
  author: User;
}
