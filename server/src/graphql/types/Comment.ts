import { Field, ID, ObjectType } from "type-graphql";
import { Post } from "./Post";
import { User } from "./User";

@ObjectType()
export class Comment {
  @Field((type) => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  text: string;

  @Field((type) => Post)
  post: Post;

  @Field((type) => User)
  author: User;
}
