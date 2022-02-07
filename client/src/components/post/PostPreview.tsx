import React from "react";
import { PostsByUserQuery } from "../../graphql/generated/graphql";
import { CommentIconFilled, HeartIcon } from "../Icons";

type Props = {
  post: PostsByUserQuery["posts"]["posts"][0];
};

export default function PostPreview({ post }: Props) {
  return (
    <a key={post.id} className="relative" href={`/p/${post.id}`}>
      <div className="relative z-0 text-white">
        <img className="select-none" src={post.imageUrl}></img>
        <div className="group absolute flex hover:bg-black hover:bg-opacity-20 justify-center inset-0 items-center z-10">
          <div
            aria-label="post stats"
            className="invisible group-hover:visible flex space-x-6 items-center"
          >
            {post.likeCount > 0 && (
              <div className="flex items-center">
                <HeartIcon className="fill-white h-6 !opacity-100 z-50" />
                <span className="font-bold ml-1">{post.likeCount}</span>
              </div>
            )}
            <div className="flex items-center">
              <CommentIconFilled className="fill-white h-6 !opacity-100 z-50" />
              <span className="font-bold ml-1">{post.commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
