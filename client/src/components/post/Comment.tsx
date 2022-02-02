import { CommentInfoFragment } from "../../graphql/generated/graphql";
import { shortTimeSince } from "../../utis/shortTimeSince";
import LikeButton from "../LikeButton";

type Props = {
  comment: CommentInfoFragment;
};

export default function Comment({ comment }: Props) {
  return (
    <ul className="flex items-center justify-start my-3 w-full">
      <div className="flex flex-shrink-0 h-full mr-4 items-start justify-start">
        <img
          src={
            comment.author.avatarUrl
              ? comment.author.avatarUrl
              : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
          }
          className="h-8 rounded-full"
        />
      </div>
      <div className="leading-4 w-full">
        <span className="leading-4">
          <h3 className="font-semibold float-left mr-1">
            {comment.author.username}
          </h3>
          <p>{comment.text}</p>
        </span>
        <section
          aria-label="comment information"
          className="flex text-gray-500 text-xs mt-2"
        >
          <p>{shortTimeSince(comment.createdAt)}</p>
          {comment.likeCount > 0 && (
            <p className="font-medium ml-4">
              {comment.likeCount} {`like${comment.likeCount > 1 ? "s" : ""}`}
            </p>
          )}
        </section>
      </div>
      <LikeButton
        entity={comment}
        className="h-8 stroke-1.5 p-2 flex-shrink-0 mb-2"
      />
    </ul>
  );
}
