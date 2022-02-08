import {
  useRemoveSavedPostMutation,
  useSavePostMutation,
} from "../graphql/generated/graphql";
import { BookmarkIcon } from "./Icons";

type Props = {
  post: {
    id: string;
    saved: boolean;
  };
  iconStyle: string;
};

export default function SaveButton({ post, iconStyle }: Props) {
  const [, savePost] = useSavePostMutation();
  const [, removeSavedPost] = useRemoveSavedPostMutation();
  const handleLike = async () => {
    if (post.saved) {
      removeSavedPost({
        id: post.id,
      });
    } else {
      savePost({
        id: post.id,
      });
    }
  };

  return (
    <button type="button" onClick={handleLike}>
      <BookmarkIcon
        className={`${
          post.saved ? "fill-black" : "hover:stroke-gray-400"
        } ${iconStyle}`}
      />
    </button>
  );
}
