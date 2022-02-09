import { CommentIcon, BookmarkIcon } from "../Icons";
import Link from "next/link";
import LikeButton from "../LikeButton";
import SaveButton from "../SaveButton";
import { useRouter } from "next/router";

type Props = {
  post: {
    id: string;
    liked: boolean;
    saved: boolean;
  };
  className?: string;
  focusForm: number;
  setFocusForm: (focusForm: number) => void;
};

export default function PostInteractionBar({
  post,
  className,
  focusForm,
  setFocusForm,
}: Props) {
  const styles = {
    icon: "h-12 stroke-1.5 p-2 flex-shrink-0 hover:stroke-gray-400",
    dynamicIcon: "h-12 stroke-1.5 p-2 flex-shrink-0",
  };

  const router = useRouter();

  return (
    <section className={className}>
      <div className="flex">
        <div>
          <LikeButton entity={post} iconStyle={styles.dynamicIcon} />
        </div>
        {router.pathname === "/p/[id]" ? (
          <button className="flex" onClick={() => setFocusForm(focusForm + 1)}>
            <CommentIcon className={styles.icon} />
          </button>
        ) : (
          <Link href={`/p/${post.id}`}>
            <a>
              <CommentIcon className={styles.icon} />
            </a>
          </Link>
        )}
      </div>
      <div>
        <SaveButton post={post} iconStyle={styles.dynamicIcon} />
      </div>
    </section>
  );
}
