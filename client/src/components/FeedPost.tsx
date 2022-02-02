import { FeedPostFragment } from "../graphql/generated/graphql";
import { timeSince } from "../utis/timeSince";
import CommentForm from "./forms/CommentForm";
import { DotsIcon } from "./Icons";
import PostInteractionBar from "./post/PostInteractionBar";

type Props = {
  post: FeedPostFragment;
};

export default function FeedPost({ post }: Props) {
  const styles = {
    icon: "h-12 stroke-1.5 p-2 flex-shrink-0",
  };

  return (
    <article className="w-full sm:w-[600px] text-m sm:border-[1px] bg-white border-gray-300 mb-3">
      <header className="h-14 flex items-center justify-between p-3">
        <div className="flex items-center">
          <img
            src={
              post.author.avatarUrl
                ? post.author.avatarUrl
                : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
            }
            className="h-8 rounded-full"
          />
          <h3 className="ml-3 font-semibold">{post.author.username}</h3>
        </div>
        <button>
          <DotsIcon className={"h-6 stroke-1.5"} />
        </button>
      </header>
      <img src={post.imageUrl} className="w-full" />
      <PostInteractionBar
        className="h-12 flex items-center justify-between"
        post={post}
      />
      <section className="flex flex-col items-start px-3 pb-3">
        {post.likeCount > 0 && (
          <h3 className="font-semibold mb-1">
            {post.likeCount} {`like${post.likeCount > 1 ? "s" : ""}`}
          </h3>
        )}
        {post.caption && (
          <span className="w-full text-left">
            <h3 className="font-semibold float-left mr-1">
              {post.author.username}
            </h3>
            <p>{post.caption}</p>
          </span>
        )}
        {post.commentCount > 2 && (
          <a className="text-gray-500">View all {post.commentCount} comments</a>
        )}
        <div>
          {post.commentsPreview.map((comment) => (
            <div key={comment.id} className="flex">
              <h3 className="font-semibold float-left mr-1">
                {comment.author.username}
              </h3>
              <p>{comment.text}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-xxs mt-2">
          {timeSince(post.createdAt).toUpperCase()}
        </p>
      </section>
      <footer className="hidden md:flex sm:border-t-[1px] border-gray-300">
        <CommentForm post={post} iconStyles={styles.icon} />
      </footer>
    </article>
  );
}
