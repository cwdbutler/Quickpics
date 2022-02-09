import { CommentIcon, BookmarkIcon } from "../Icons";
import Link from "next/link";
import LikeButton from "../LikeButton";
import SaveButton from "../SaveButton";

type Props = {
  post: {
    id: string;
    liked: boolean;
    saved: boolean;
  };
  className?: string;
};

export default function PostInteractionBar({ post, className }: Props) {
  const styles = {
    icon: "h-12 stroke-1.5 p-2 flex-shrink-0 hover:stroke-gray-400",
    dynamicIcon: "h-12 stroke-1.5 p-2 flex-shrink-0",
  };

  return (
    <section className={className}>
      <div className="flex">
        <div>
          <LikeButton entity={post} iconStyle={styles.dynamicIcon} />
        </div>
        <Link href={`/p/${post.id}`}>
          <a>
            <CommentIcon className={styles.icon} />
          </a>
        </Link>
      </div>
      <div>
        <SaveButton post={post} iconStyle={styles.dynamicIcon} />
      </div>
    </section>
  );
}
