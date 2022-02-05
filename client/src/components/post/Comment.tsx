import {
  CommentInfoFragment,
  CurrentUserQuery,
} from "../../graphql/generated/graphql";
import { shortTimeSince } from "../../utis/shortTimeSince";
import LikeButton from "../LikeButton";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { DotsIcon } from "../Icons";
import { useMemo, useState } from "react";
import CommentActions from "./CommentActions";

type Props = {
  comment: CommentInfoFragment;
  user: CurrentUserQuery["currentUser"];
};

export default function Comment({ comment, user }: Props) {
  dayjs.extend(LocalizedFormat);

  const [showCommentMenu, setShowCommentMenu] = useState(false);

  const [open, setOpen] = useState(false);

  const commentTime = useMemo(() => shortTimeSince(comment.createdAt), []);
  // stops date changing on each hover

  return (
    <>
      <CommentActions open={open} setOpen={setOpen} commentId={comment.id} />
      <ul
        onMouseEnter={() => setShowCommentMenu(true)}
        onMouseLeave={() => setShowCommentMenu(false)}
        className="flex items-center justify-start my-3 w-full"
      >
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
            className="flex text-gray-500 text-xs mt-2 space-x-4"
          >
            <time
              dateTime={comment.createdAt}
              title={dayjs(comment.createdAt).format("ll")}
            >
              {commentTime}
            </time>
            {comment.likeCount > 0 && (
              <p className="font-medium">
                {comment.likeCount} {`like${comment.likeCount > 1 ? "s" : ""}`}
              </p>
            )}
            {user?.id === comment.author.id && (
              <button
                onClick={() => setOpen(true)}
                className={showCommentMenu ? "visible" : "invisible"}
              >
                <DotsIcon className="h-5" />
              </button>
            )}
          </section>
        </div>
        <LikeButton
          entity={comment}
          className="h-8 stroke-1.5 p-2 flex-shrink-0 mb-2"
        />
      </ul>
    </>
  );
}
