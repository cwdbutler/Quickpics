import { Field, ObjectType } from "type-graphql";
import { Post } from "./Post";

@ObjectType()
export class PostsResponse {
  @Field(() => [Post])
  posts: Post[];

  @Field()
  hasMore: boolean;
}
