import { CommentIcon, BookmarkIcon } from "../Icons";
import Link from "next/link";
import LikeButton from "../LikeButton";

type Props = {
  post: {
    id: string;
    liked: boolean;
  };
  className?: string;
};

export default function PostInteractionBar({ post, className }: Props) {
  const styles = {
    icon: "h-12 stroke-1.5 p-2 flex-shrink-0 hover:stroke-gray-400",
    heart: "h-12 stroke-1.5 p-2 flex-shrink-0",
  };

  return (
    <section className={className}>
      <div className="flex">
        <LikeButton entity={post} className={styles.heart} />
        <Link href={`/p/${post.id}`}>
          <button onClick={() => {}}>
            <CommentIcon className={styles.icon} />
          </button>
        </Link>
      </div>
      <div>
        <BookmarkIcon className={styles.icon} />
      </div>
    </section>
  );
}
