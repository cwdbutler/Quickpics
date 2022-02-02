import { Field, Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import {
  FeedPostFragment,
  PostQuery,
  useCreateCommentMutation,
} from "../../graphql/generated/graphql";
import { MAX_TEXT_LENGTH } from "../../utis/constants";
import { HappyIcon } from "../Icons";

type Props = {
  post: FeedPostFragment | PostQuery["post"];
  iconStyles: string;
};

export default function CommentForm({ post, iconStyles }: Props) {
  const [loading, setLoading] = useState(false);
  const [, createComment] = useCreateCommentMutation();

  const inputRef = useRef<any>();

  return (
    <Formik
      initialValues={{
        text: "",
      }}
      onSubmit={async (values, { resetForm }) => {
        console.log("i submitted");
        setLoading(true);
        const response = await createComment({
          text: values.text,
          postId: post!.id,
        });
        console.log("res", response);
        setLoading(false);
        if (response.data?.createComment.comment) {
          console.log("done");
          resetForm();
        }
        // need to handle errors here, although there shouldn't be many
      }}
    >
      {({ values }) => (
        <Form className="w-full flex items-center justify-center">
          {loading ? (
            <div className="h-12 flex items-center justify-center">
              Loading...
            </div>
          ) : (
            <>
              <HappyIcon className={iconStyles} />
              <Field
                innerRef={(el: any) => (inputRef.current = el)}
                as="textarea"
                type="text"
                id="text"
                name="text"
                placeholder="Add a comment..."
                className="outline-none w-full p-2 h-12 resize-none pt-3.5 leading-5"
                value={
                  values.text.length >= MAX_TEXT_LENGTH
                    ? values.text.substring(0, MAX_TEXT_LENGTH - 1)
                    : values.text
                }
                // prevent typing if max lengh reached
              />
              <button
                type="submit"
                className={`${
                  values.text.length === 0 ? "text-lightblue" : "text-blue"
                } p-2 font-semibold`}
                disabled={values.text.length === 0}
              >
                Post
              </button>
            </>
          )}
        </Form>
      )}
    </Formik>
  );
}
