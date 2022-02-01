import { Field, ID, ObjectType } from "type-graphql";

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

  // just including the ideas here to avoid an infinite nesting loop
  @Field()
  postId: string;

  @Field()
  authorId: number;
}
