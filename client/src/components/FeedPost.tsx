import {
  FeedPostFragment,
  useCurrentUserQuery,
} from "../graphql/generated/graphql";
import { timeSince } from "../utis/timeSince";
import CommentForm from "./forms/CommentForm";
import { DotsIcon } from "./Icons";
import PostInteractionBar from "./post/PostInteractionBar";
import Link from "next/link";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { useState } from "react";
import PostActions from "./post/PostActions";
import Image from "next/image";
import LikesModal from "./post/LikesModal";
import { BLUR_PIXEL } from "../utis/constants";

type Props = {
  post: FeedPostFragment;
};

export default function FeedPost({ post }: Props) {
  dayjs.extend(LocalizedFormat);

  const styles = {
    icon: "h-12 stroke-1.5 p-2 flex-shrink-0",
  };

  const [{ data }] = useCurrentUserQuery();

  const [open, setOpen] = useState(false);
  const [likesOpen, setLikesOpen] = useState(false);

  return (
    <>
      <PostActions
        open={open}
        setOpen={setOpen}
        post={post}
        user={data?.currentUser}
      />
      <article className="w-full sm:w-[600px] text-m sm:border-[1px] bg-white border-gray-300 mb-3 sm:mb-6">
        <header className="h-14 flex items-center justify-between p-3">
          <div className="flex items-center space-x-3">
            <Link href={`/${post.author.username}`}>
              <a className="flex">
                <Image
                  objectFit="cover"
                  src={
                    post.author.avatarUrl
                      ? post.author.avatarUrl
                      : "/default.jpg"
                  }
                  className="rounded-full select-none"
                  draggable={false}
                  width={32}
                  height={32}
                />
              </a>
            </Link>

            <Link href={`/${post.author.username}`}>
              <a>
                <h3 className="font-semibold">{post.author.username}</h3>
              </a>
            </Link>
          </div>
          <button onClick={() => setOpen(true)}>
            <DotsIcon className={"h-6 stroke-1.5"} />
          </button>
        </header>
        <Image
          src={post.imageUrl}
          draggable={false}
          width={600}
          height={600}
          className="select-none"
          placeholder="blur"
          blurDataURL={BLUR_PIXEL}
        />
        <PostInteractionBar
          className="h-12 flex items-center justify-between"
          post={post}
        />
        <section className="flex flex-col items-start px-3 pb-3 leading-text space-y-1">
          {post.likeCount > 0 && (
            <>
              <LikesModal
                entityId={post.id}
                likesOpen={likesOpen}
                setLikesOpen={setLikesOpen}
                type="post"
              />
              <button type="button" onClick={() => setLikesOpen(true)}>
                <h3 className="font-semibold mb-1">
                  {post.likeCount} {`like${post.likeCount > 1 ? "s" : ""}`}
                </h3>
              </button>
            </>
          )}
          {post.caption && (
            <span className="w-full text-left">
              <Link href={`/${post.author.username}`}>
                <a>
                  <h3 className="font-semibold float-left mr-1 hover:underline">
                    {post.author.username}
                  </h3>
                </a>
              </Link>
              <p>{post.caption}</p>
            </span>
          )}
          {post.commentCount > 2 && (
            <Link href={`/p/${post.id}`}>
              <a className="text-gray-500">
                View all {post.commentCount} comments
              </a>
            </Link>
          )}
          <div className="space-y-1 w-full">
            {post.commentsPreview.map((comment) => (
              <div key={comment.id} className="w-full">
                <Link href={`/${post.author.username}`}>
                  <a>
                    <h3 className="float-left font-semibold mr-1 hover:underline">
                      {comment.author.username}
                    </h3>
                  </a>
                </Link>
                <p>{comment.text}</p>
              </div>
            ))}
          </div>
          <time
            dateTime={post.createdAt}
            title={dayjs(post.createdAt).format("ll")}
            className="text-gray-500 text-xxs mt-2"
          >
            {timeSince(post.createdAt).toUpperCase()}
          </time>
        </section>
        <footer className="hidden md:flex sm:border-t-[1px] border-gray-300">
          <CommentForm
            currentUser={data?.currentUser}
            post={post}
            iconStyles={styles.icon}
          />
        </footer>
      </article>
    </>
  );
}
