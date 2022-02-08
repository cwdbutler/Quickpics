import {
  useLikeMutation,
  useRemoveLikeMutation,
} from "../graphql/generated/graphql";
import { HeartIcon } from "./Icons";

type Props = {
  entity: {
    id: string;
    liked: boolean;
  };
  iconStyle: string;
};

export default function LikeButton({ entity, iconStyle }: Props) {
  const [, like] = useLikeMutation();
  const [, removeLike] = useRemoveLikeMutation();

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
        } ${iconStyle}`}
      />
    </button>
  );
}
