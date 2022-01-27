import { PostWithAuthorFragment } from "../graphql/generated/graphql";
import { timeSince } from "../utis/timeSince";

type Props = {
  post: PostWithAuthorFragment;
};

export default function FeedPost({ post }: Props) {
  return (
    <article className="w-[480px] h-[680px] border-2 mb-3">
      <header className="h-14 border-b-2 flex items-center p-3">
        <img
          src={
            post.author.avatarUrl
              ? post.author.avatarUrl
              : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
          }
          className="h-8 rounded-full"
        />
        <h3 className="ml-3 font-semibold">{post.author.username}</h3>
      </header>
      <img src={post.imageUrl} className="w-full" />
      <section className="h-12 border-b-2">{/* insert icons here */}</section>
      <section className="flex flex-col items-start justify-between p-3">
        <div>likes</div>
        <span className="flex">
          <h3 className="font-semibold">{post.author.username}</h3>
          <p className="ml-1">{post.caption}</p>
        </span>
        <footer>{timeSince(post.createdAt)}</footer>
      </section>
    </article>
  );
}
