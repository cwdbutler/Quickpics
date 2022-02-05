import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import CommentForm from "../../components/forms/CommentForm";
import { DotsIcon } from "../../components/Icons";
import NavBar from "../../components/NavBar";
import Comment from "../../components/post/Comment";
import PostInteractionBar from "../../components/post/PostInteractionBar";
import {
  useCurrentUserQuery,
  usePostQuery,
} from "../../graphql/generated/graphql";
import { urqlClient } from "../../urqlClient";
import { timeSince } from "../../utis/timeSince";
import ErrorPage from "../404";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import PostActions from "../../components/post/PostActions";

function Post() {
  const [mounted, setMounted] = useState(false);
  dayjs.extend(LocalizedFormat);

  useEffect(() => {
    setMounted(true);
  }, []);
  // prevent server side render conflicting with client

  const router = useRouter();

  const [{ data: userData }] = useCurrentUserQuery();

  const [{ data, fetching }] = usePostQuery({
    pause: !(router.query.id as string).match(/^[a-zA-Z0-9]+$/),
    // don't send the query if it's not a valid id
    variables: {
      id: router.query.id as string,
    },
  });

  const styles = {
    icon: "h-12 stroke-1.5 p-2 flex-shrink-0",
  };

  if (!fetching && !data?.post) {
    return <ErrorPage />;
  }

  const [open, setOpen] = useState(false);

  return mounted && data && data.post ? (
    <>
      <NavBar />
      <PostActions
        open={open}
        setOpen={setOpen}
        post={data.post}
        user={userData?.currentUser}
      />
      <div className="flex w-full justify-center my-12">
        <article className="w-full md:w-[935px] md:h-[600px] border-[1px] flex flex-col md:flex-row text-m border-gray-300 bg-white">
          <img src={data.post.imageUrl} className="w-full" />
          <div className="w-full flex flex-col justify-between">
            <header className="h-[60px] w-full hidden md:flex items-center justify-between p-4 border-b-[1px] border-gray-300">
              <div className="flex items-center">
                <img
                  src={
                    data.post.author.avatarUrl
                      ? data.post.author.avatarUrl
                      : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                  }
                  className="h-8 rounded-full"
                />
                <h3 className="ml-3 font-semibold">
                  {data.post.author.username}
                </h3>
              </div>
              <button onClick={() => setOpen(true)}>
                <DotsIcon className={"h-6 stroke-1.5"} />
              </button>
            </header>
            <section className="hidden h-full md:flex flex-col items-start justify-start p-4 leading-5 overflow-auto no-scrollbar">
              {data.post.caption && (
                <span className="flex mb-2">
                  <img
                    src={
                      data.post.author.avatarUrl
                        ? data.post.author.avatarUrl
                        : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                    }
                    className="h-8 rounded-full mr-4"
                  />
                  <span>
                    <h3 className="font-semibold float-left mr-1">
                      {data.post.author.username}
                    </h3>
                    <p>{data.post.caption}</p>
                  </span>
                </span>
              )}
              {data.post.comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  user={userData?.currentUser}
                />
              ))}
            </section>
            <footer className="border-t-[1px] border-gray-300 flex flex-col">
              <PostInteractionBar
                post={data.post}
                className="w-full flex px-1 pt-1 justify-between"
              />
              <div className="flex h-7 px-4">
                {data.post.likeCount > 0 ? (
                  <p className="font-semibold">
                    {data.post.likeCount}{" "}
                    {`like${data.post.likeCount > 1 ? "s" : ""}`}
                  </p>
                ) : (
                  <span className="flex">
                    Be the first to
                    <p className="ml-1 font-semibold"> like this</p>
                  </span>
                )}
              </div>
              <time
                dateTime={data.post.createdAt}
                title={dayjs(data.post.createdAt).format("ll")}
                className="text-gray-500 text-xxs flex items-center px-4 mb-4"
              >
                {timeSince(data.post.createdAt).toUpperCase()}
              </time>
              <section className="border-t-[1px] border-gray-300 hidden md:flex">
                <CommentForm post={data.post} iconStyles={styles.icon} />
              </section>
            </footer>
          </div>
        </article>
      </div>
    </>
  ) : null;
}

export default withUrqlClient(urqlClient, { ssr: true })(Post);
