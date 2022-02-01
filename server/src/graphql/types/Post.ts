import { Field, ID, ObjectType } from "type-graphql";
import { Comment } from "./Comment";
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

  @Field()
  imageUrl: string;

  @Field((type) => User)
  author: User;

  @Field((type) => [Comment])
  comments: Comment[];
}
