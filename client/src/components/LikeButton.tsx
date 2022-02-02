import {
  useLikeMutation,
  useRemoveLikeMutation,
} from "../graphql/generated/graphql";
import { HeartIcon, CommentIcon, BookmarkIcon } from "./Icons";

type Props = {
  entity: {
    id: string;
    liked: boolean;
  };
  className?: string;
};

export default function LikeButton({ entity, className }: Props) {
  const [, like] = useLikeMutation();
  const [, removeLike] = useRemoveLikeMutation();

  const styles = {
    icon: "h-12 stroke-1.5 p-2 flex-shrink-0 hover:stroke-gray-400",
    heart: className,
  };

  const handleLike = async () => {
    if (entity.liked) {
      removeLike({
        entityId: entity.id,
      });
    } else {
      like({
        entityId: entity.id,
      });
    }
  };

  return (
    <button type="button" onClick={handleLike}>
      <HeartIcon
        className={`${
          entity.liked ? "fill-red-600 stroke-red-600" : "hover:stroke-gray-400"
        } ${styles.heart}`}
      />
    </button>
  );
}
