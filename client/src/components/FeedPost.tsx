import { PostWithAuthorFragment } from "../graphql/generated/graphql";
import { timeSince } from "../utis/timeSince";
import {
  BookmarkIcon,
  CommentIcon,
  DotsIcon,
  HappyIcon,
  HeartIcon,
} from "./Icons";

type Props = {
  post: PostWithAuthorFragment;
};

export default function FeedPost({ post }: Props) {
  const styles = {
    icon: "h-12 stroke-1.5 p-2 flex-shrink-0",
  };
  return (
    <article className="w-[480px] overflow-v border-[1px] bg-white border-gray-300 mb-3">
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
      <div className="h-12 border-b-[1px] border-gray-300 flex items-center justify-between">
        <div className="flex">
          <HeartIcon className={styles.icon} />
          <CommentIcon className={styles.icon} />
        </div>
        <div>
          <BookmarkIcon className={styles.icon} />
        </div>
      </div>
      <section className="flex flex-col items-start justify-between p-3 border-b-[1px] border-gray-300">
        <div>likes</div>
        <span className="w-full text-left leading-5 my-2">
          <h3 className="font-semibold float-left mr-1">
            {post.author.username}
          </h3>
          <p>{post.caption}</p>
        </span>
        <p className="text-xs text-gray-500">
          {timeSince(post.createdAt).toUpperCase()}
        </p>
      </section>
      <footer className="flex">
        <HappyIcon className={styles.icon} />
        <input
          type="text"
          placeholder="Add a comment..."
          className="outline-none w-full p-2"
        />
        <button className="p-2 text-lightblue  font-semibold">Post</button>
      </footer>
    </article>
  );
}
