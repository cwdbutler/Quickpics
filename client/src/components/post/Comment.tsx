import { CommentInfoFragment } from "../../graphql/generated/graphql";

type Props = {
  comment: CommentInfoFragment;
};

export default function Comment({ comment }: Props) {
  return (
    <div className="flex items-center justify-center mb-2">
      <img
        src={
          comment.author.avatarUrl
            ? comment.author.avatarUrl
            : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
        }
        className="h-8 rounded-full"
      />
      <div className="flex ml-2 flex-shrink">
        <h3 className="font-semibold float-left mr-1">
          {comment.author.username}
        </h3>
        <p>{comment.text}</p>
      </div>
    </div>
  );
}
