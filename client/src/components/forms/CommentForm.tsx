import { Field, Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import {
  FeedPostFragment,
  PostQuery,
  useCreateCommentMutation,
  UserInfoFragment,
} from "../../graphql/generated/graphql";
import { MAX_TEXT_LENGTH } from "../../utis/constants";
import { HappyIcon } from "../Icons";
import { Waypoint } from "react-waypoint";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { useDetectClickOutside } from "react-detect-click-outside";
import Link from "next/link";
import Spinner from "../Spinner";

type Props = {
  currentUser: UserInfoFragment | null | undefined;
  post: FeedPostFragment | PostQuery["post"];
  iconStyles: string;
  focusForm: number;
};

export default function CommentForm({
  post,
  iconStyles,
  currentUser,
  focusForm,
}: Props) {
  if (!currentUser) {
    return (
      <div className="flex">
        <HappyIcon className={iconStyles} />
        <div className="h-12 flex items-center justify-center">
          <p>
            <Link href={"/login"}>
              <a className="mr-1 text-blue hover:underline font-semibold">
                Log in
              </a>
            </Link>
          </p>
          to comment
        </div>
      </div>
    );
  }

  const [loading, setLoading] = useState(false);
  const [, createComment] = useCreateCommentMutation();

  const [showEmojiMenu, setShowEmojimenu] = useState(false);

  const emojiRef = useDetectClickOutside({
    onTriggered: () => setShowEmojimenu(false),
  });
  // hide the emoji menu if clicked outside

  const inputRef = useRef<any>();

  useEffect(() => {
    if (focusForm > 0) {
      // avoid focus on mount
      inputRef.current.focus();
    }
  }, [focusForm]);

  return (
    <Formik
      initialValues={{
        text: "",
      }}
      onSubmit={async (values, { resetForm }) => {
        setLoading(true);
        const response = await createComment({
          text: values.text,
          postId: post!.id,
        });
        setLoading(false);
        if (response.data?.createComment.comment) {
          resetForm();
          setShowEmojimenu(false);
        }
        // need to handle errors here, although there shouldn't be many
      }}
    >
      {({ values, setFieldValue }) => (
        <Form className="w-full flex items-center justify-center">
          {loading ? (
            <div className="flex">
              <div className="h-12 flex items-center justify-center">
                <Spinner />
              </div>
            </div>
          ) : (
            <>
              <div ref={emojiRef} className="flex">
                <div className="relative">
                  <Waypoint
                    topOffset={"300px"}
                    onLeave={() => setShowEmojimenu(false)}
                    onEnter={() => setShowEmojimenu(false)}

                    // workaround for hiding the menu when another post appears in the feed
                  />
                  {showEmojiMenu && (
                    <div>
                      <Picker
                        style={{
                          position: "absolute",
                          bottom: "48px",
                        }}
                        onSelect={(emoji: any) => {
                          if (emoji.native) {
                            setFieldValue("text", values.text + emoji.native);
                            setShowEmojimenu(false);
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowEmojimenu(!showEmojiMenu);
                    inputRef.current.focus();
                  }}
                >
                  <HappyIcon className={iconStyles} />
                </button>
              </div>
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
