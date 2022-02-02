import {
  useLikeMutation,
  useRemoveLikeMutation,
} from "../../graphql/generated/graphql";
import { HeartIcon, CommentIcon, BookmarkIcon } from "../Icons";
import Link from "next/link";

type Props = {
  post: {
    id: string;
    liked: boolean;
  };
  className?: string;
};

export default function PostInteractionBar({ post, className }: Props) {
  const [, like] = useLikeMutation();
  const [, removeLike] = useRemoveLikeMutation();

  const styles = {
    icon: "h-12 stroke-1.5 p-2 flex-shrink-0",
  };

  const handleLike = async () => {
    if (post.liked) {
      removeLike({
        entityId: post.id,
      });
    } else {
      like({
        entityId: post.id,
      });
    }
  };
  return (
    <section className={className}>
      <div className="flex">
        <button type="button" onClick={handleLike}>
          <HeartIcon
            className={`${post.liked && "fill-red-600 stroke-red-600"} ${
              styles.icon
            }`}
          />
        </button>
        <Link href={`/p/${post.id}`}>
          <button>
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
