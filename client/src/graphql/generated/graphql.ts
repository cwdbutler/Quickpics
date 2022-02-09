import { Resolver as GraphCacheResolver, UpdateResolver as GraphCacheUpdateResolver, OptimisticMutationResolver as GraphCacheOptimisticMutationResolver, StorageAdapter as GraphCacheStorageAdapter } from '@urql/exchange-graphcache';
import { IntrospectionData } from '@urql/exchange-graphcache/dist/types/ast';
import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Activity = Post;

export type Comment = {
  __typename?: 'Comment';
  author: User;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  likeCount: Scalars['Int'];
  liked: Scalars['Boolean'];
  likes: Array<Like>;
  postId: Scalars['String'];
  text: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type CreateCommentResponse = {
  __typename?: 'CreateCommentResponse';
  comment?: Maybe<Comment>;
  errors?: Maybe<Array<FieldError>>;
};

export type CreatePostResponse = {
  __typename?: 'CreatePostResponse';
  errors?: Maybe<Array<FieldError>>;
  post?: Maybe<Post>;
};

export type CreateUserResponse = {
  __typename?: 'CreateUserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Like = {
  __typename?: 'Like';
  author: User;
  entityId: Scalars['String'];
  id: Scalars['ID'];
  likedAt: Scalars['DateTime'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createComment: CreateCommentResponse;
  createPost: CreatePostResponse;
  deleteComment: CreateCommentResponse;
  deletePost: CreatePostResponse;
  like: Scalars['Boolean'];
  login: CreateUserResponse;
  logout: Scalars['Boolean'];
  register: CreateUserResponse;
  removeLike: Scalars['Boolean'];
  removeProfilePic: User;
  removeSavedPost: Scalars['Boolean'];
  savePost: Scalars['Boolean'];
  updateComment: CreateCommentResponse;
  updatePost: CreatePostResponse;
  updateProfilePic: User;
};


export type MutationCreateCommentArgs = {
  postId: Scalars['String'];
  text: Scalars['String'];
};


export type MutationCreatePostArgs = {
  caption: Scalars['String'];
  file: Scalars['Upload'];
};


export type MutationDeleteCommentArgs = {
  id: Scalars['String'];
};


export type MutationDeletePostArgs = {
  id: Scalars['String'];
};


export type MutationLikeArgs = {
  entityId: Scalars['String'];
};


export type MutationLoginArgs = {
  emailOrUsername: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationRemoveLikeArgs = {
  entityId: Scalars['String'];
};


export type MutationRemoveSavedPostArgs = {
  id: Scalars['String'];
};


export type MutationSavePostArgs = {
  id: Scalars['String'];
};


export type MutationUpdateCommentArgs = {
  id: Scalars['String'];
  text: Scalars['String'];
};


export type MutationUpdatePostArgs = {
  caption: Scalars['String'];
  id: Scalars['String'];
};


export type MutationUpdateProfilePicArgs = {
  file: Scalars['Upload'];
};

export type Post = {
  __typename?: 'Post';
  author: User;
  caption?: Maybe<Scalars['String']>;
  commentCount: Scalars['Int'];
  comments: Array<Comment>;
  commentsPreview: Array<Comment>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  imageUrl: Scalars['String'];
  likeCount: Scalars['Int'];
  liked: Scalars['Boolean'];
  likes: Array<Like>;
  saved: Scalars['Boolean'];
  updatedAt: Scalars['DateTime'];
};

export type PostsResponse = {
  __typename?: 'PostsResponse';
  hasMore: Scalars['Boolean'];
  posts: Array<Post>;
};

export type Query = {
  __typename?: 'Query';
  currentUser?: Maybe<User>;
  feed: Array<Activity>;
  post?: Maybe<Post>;
  posts: PostsResponse;
  savedPosts: PostsResponse;
  suggestedUsers?: Maybe<Array<User>>;
  user?: Maybe<User>;
};


export type QueryPostArgs = {
  id: Scalars['String'];
};


export type QueryPostsArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  take: Scalars['Int'];
  username?: InputMaybe<Scalars['String']>;
};


export type QuerySavedPostsArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  take: Scalars['Int'];
};


export type QueryUserArgs = {
  id?: InputMaybe<Scalars['Int']>;
  username?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  avatarUrl?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['ID'];
  postCount: Scalars['Int'];
  updatedAt: Scalars['DateTime'];
  username: Scalars['String'];
};

export type CommentInfoFragment = { __typename?: 'Comment', id: string, text: string, liked: boolean, likeCount: number, createdAt: any, updatedAt: any, author: { __typename?: 'User', id: string, username: string, avatarUrl?: string | null | undefined } };

export type FeedPostFragment = { __typename?: 'Post', id: string, createdAt: any, imageUrl: string, caption?: string | null | undefined, saved: boolean, liked: boolean, likeCount: number, commentCount: number, author: { __typename?: 'User', id: string, username: string, avatarUrl?: string | null | undefined }, commentsPreview: Array<{ __typename?: 'Comment', id: string, text: string, author: { __typename?: 'User', username: string } }> };

export type UserInfoFragment = { __typename?: 'User', id: string, username: string, avatarUrl?: string | null | undefined };

export type CreateCommentMutationVariables = Exact<{
  text: Scalars['String'];
  postId: Scalars['String'];
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment: { __typename?: 'CreateCommentResponse', comment?: { __typename?: 'Comment', id: string, text: string, createdAt: any, author: { __typename?: 'User', username: string } } | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } };

export type CreatePostMutationVariables = Exact<{
  caption: Scalars['String'];
  file: Scalars['Upload'];
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'CreatePostResponse', post?: { __typename?: 'Post', id: string, caption?: string | null | undefined, imageUrl: string } | null | undefined } };

export type DeleteCommentMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteCommentMutation = { __typename?: 'Mutation', deleteComment: { __typename?: 'CreateCommentResponse', comment?: { __typename?: 'Comment', id: string, postId: string } | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } };

export type DeletePostMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: { __typename?: 'CreatePostResponse', post?: { __typename?: 'Post', id: string } | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } };

export type LikeMutationVariables = Exact<{
  entityId: Scalars['String'];
}>;


export type LikeMutation = { __typename?: 'Mutation', like: boolean };

export type LoginMutationVariables = Exact<{
  emailOrUsername: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'CreateUserResponse', user?: { __typename?: 'User', id: string, username: string, avatarUrl?: string | null | undefined } | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'CreateUserResponse', user?: { __typename?: 'User', id: string, username: string, avatarUrl?: string | null | undefined } | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } };

export type RemoveLikeMutationVariables = Exact<{
  entityId: Scalars['String'];
}>;


export type RemoveLikeMutation = { __typename?: 'Mutation', removeLike: boolean };

export type RemoveProfilePicMutationVariables = Exact<{ [key: string]: never; }>;


export type RemoveProfilePicMutation = { __typename?: 'Mutation', removeProfilePic: { __typename?: 'User', id: string, username: string, avatarUrl?: string | null | undefined } };

export type RemoveSavedPostMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type RemoveSavedPostMutation = { __typename?: 'Mutation', removeSavedPost: boolean };

export type SavePostMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type SavePostMutation = { __typename?: 'Mutation', savePost: boolean };

export type UpdateProfilePicMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type UpdateProfilePicMutation = { __typename?: 'Mutation', updateProfilePic: { __typename?: 'User', id: string, username: string, avatarUrl?: string | null | undefined } };

export type AllPostsQueryVariables = Exact<{
  take: Scalars['Int'];
  cursor?: InputMaybe<Scalars['String']>;
}>;


export type AllPostsQuery = { __typename?: 'Query', posts: { __typename?: 'PostsResponse', hasMore: boolean, posts: Array<{ __typename?: 'Post', id: string, createdAt: any, imageUrl: string, caption?: string | null | undefined, saved: boolean, liked: boolean, likeCount: number, commentCount: number, author: { __typename?: 'User', id: string, username: string, avatarUrl?: string | null | undefined }, commentsPreview: Array<{ __typename?: 'Comment', id: string, text: string, author: { __typename?: 'User', username: string } }> }> } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, username: string, avatarUrl?: string | null | undefined } | null | undefined };

export type PostQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type PostQuery = { __typename?: 'Query', post?: { __typename?: 'Post', id: string, createdAt: any, imageUrl: string, caption?: string | null | undefined, saved: boolean, liked: boolean, likeCount: number, commentCount: number, author: { __typename?: 'User', id: string, username: string, avatarUrl?: string | null | undefined }, comments: Array<{ __typename?: 'Comment', id: string, text: string, liked: boolean, likeCount: number, createdAt: any, updatedAt: any, author: { __typename?: 'User', id: string, username: string, avatarUrl?: string | null | undefined } }> } | null | undefined };

export type PostLikesQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type PostLikesQuery = { __typename?: 'Query', post?: { __typename?: 'Post', id: string, likes: Array<{ __typename?: 'Like', likedAt: any, author: { __typename?: 'User', username: string, avatarUrl?: string | null | undefined } }> } | null | undefined };

export type PostsByUserQueryVariables = Exact<{
  take: Scalars['Int'];
  cursor?: InputMaybe<Scalars['String']>;
  username: Scalars['String'];
}>;


export type PostsByUserQuery = { __typename?: 'Query', posts: { __typename?: 'PostsResponse', hasMore: boolean, posts: Array<{ __typename?: 'Post', id: string, imageUrl: string, likeCount: number, commentCount: number }> } };

export type SavedPostsQueryVariables = Exact<{
  take: Scalars['Int'];
  cursor?: InputMaybe<Scalars['String']>;
}>;


export type SavedPostsQuery = { __typename?: 'Query', savedPosts: { __typename?: 'PostsResponse', hasMore: boolean, posts: Array<{ __typename?: 'Post', id: string, imageUrl: string, likeCount: number, commentCount: number }> } };

export type SuggestedUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type SuggestedUsersQuery = { __typename?: 'Query', suggestedUsers?: Array<{ __typename?: 'User', id: string, username: string, avatarUrl?: string | null | undefined }> | null | undefined };

export type UserQueryVariables = Exact<{
  id?: InputMaybe<Scalars['Int']>;
  username?: InputMaybe<Scalars['String']>;
}>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'User', postCount: number, id: string, username: string, avatarUrl?: string | null | undefined } | null | undefined };

export const UserInfoFragmentDoc = gql`
    fragment UserInfo on User {
  id
  username
  avatarUrl
}
    `;
export const CommentInfoFragmentDoc = gql`
    fragment CommentInfo on Comment {
  id
  text
  author {
    ...UserInfo
  }
  liked
  likeCount
  createdAt
  updatedAt
}
    ${UserInfoFragmentDoc}`;
export const FeedPostFragmentDoc = gql`
    fragment FeedPost on Post {
  id
  createdAt
  imageUrl
  caption
  author {
    ...UserInfo
  }
  saved
  liked
  likeCount
  commentsPreview {
    id
    text
    author {
      username
    }
  }
  commentCount
}
    ${UserInfoFragmentDoc}`;
export const CreateCommentDocument = gql`
    mutation createComment($text: String!, $postId: String!) {
  createComment(text: $text, postId: $postId) {
    comment {
      id
      text
      author {
        username
      }
      createdAt
    }
    errors {
      field
      message
    }
  }
}
    `;

export function useCreateCommentMutation() {
  return Urql.useMutation<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument);
};
export const CreatePostDocument = gql`
    mutation createPost($caption: String!, $file: Upload!) {
  createPost(caption: $caption, file: $file) {
    post {
      id
      caption
      imageUrl
    }
  }
}
    `;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const DeleteCommentDocument = gql`
    mutation deleteComment($id: String!) {
  deleteComment(id: $id) {
    comment {
      id
      postId
    }
    errors {
      field
      message
    }
  }
}
    `;

export function useDeleteCommentMutation() {
  return Urql.useMutation<DeleteCommentMutation, DeleteCommentMutationVariables>(DeleteCommentDocument);
};
export const DeletePostDocument = gql`
    mutation deletePost($id: String!) {
  deletePost(id: $id) {
    post {
      id
    }
    errors {
      field
      message
    }
  }
}
    `;

export function useDeletePostMutation() {
  return Urql.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument);
};
export const LikeDocument = gql`
    mutation like($entityId: String!) {
  like(entityId: $entityId)
}
    `;

export function useLikeMutation() {
  return Urql.useMutation<LikeMutation, LikeMutationVariables>(LikeDocument);
};
export const LoginDocument = gql`
    mutation login($emailOrUsername: String!, $password: String!) {
  login(emailOrUsername: $emailOrUsername, password: $password) {
    user {
      ...UserInfo
    }
    errors {
      field
      message
    }
  }
}
    ${UserInfoFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation register($email: String!, $username: String!, $password: String!) {
  register(email: $email, username: $username, password: $password) {
    user {
      ...UserInfo
    }
    errors {
      field
      message
    }
  }
}
    ${UserInfoFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const RemoveLikeDocument = gql`
    mutation removeLike($entityId: String!) {
  removeLike(entityId: $entityId)
}
    `;

export function useRemoveLikeMutation() {
  return Urql.useMutation<RemoveLikeMutation, RemoveLikeMutationVariables>(RemoveLikeDocument);
};
export const RemoveProfilePicDocument = gql`
    mutation removeProfilePic {
  removeProfilePic {
    ...UserInfo
  }
}
    ${UserInfoFragmentDoc}`;

export function useRemoveProfilePicMutation() {
  return Urql.useMutation<RemoveProfilePicMutation, RemoveProfilePicMutationVariables>(RemoveProfilePicDocument);
};
export const RemoveSavedPostDocument = gql`
    mutation removeSavedPost($id: String!) {
  removeSavedPost(id: $id)
}
    `;

export function useRemoveSavedPostMutation() {
  return Urql.useMutation<RemoveSavedPostMutation, RemoveSavedPostMutationVariables>(RemoveSavedPostDocument);
};
export const SavePostDocument = gql`
    mutation savePost($id: String!) {
  savePost(id: $id)
}
    `;

export function useSavePostMutation() {
  return Urql.useMutation<SavePostMutation, SavePostMutationVariables>(SavePostDocument);
};
export const UpdateProfilePicDocument = gql`
    mutation updateProfilePic($file: Upload!) {
  updateProfilePic(file: $file) {
    ...UserInfo
  }
}
    ${UserInfoFragmentDoc}`;

export function useUpdateProfilePicMutation() {
  return Urql.useMutation<UpdateProfilePicMutation, UpdateProfilePicMutationVariables>(UpdateProfilePicDocument);
};
export const AllPostsDocument = gql`
    query allPosts($take: Int!, $cursor: String) {
  posts(take: $take, cursor: $cursor) {
    posts {
      ...FeedPost
    }
    hasMore
  }
}
    ${FeedPostFragmentDoc}`;

export function useAllPostsQuery(options: Omit<Urql.UseQueryArgs<AllPostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<AllPostsQuery>({ query: AllPostsDocument, ...options });
};
export const CurrentUserDocument = gql`
    query currentUser {
  currentUser {
    ...UserInfo
  }
}
    ${UserInfoFragmentDoc}`;

export function useCurrentUserQuery(options: Omit<Urql.UseQueryArgs<CurrentUserQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CurrentUserQuery>({ query: CurrentUserDocument, ...options });
};
export const PostDocument = gql`
    query post($id: String!) {
  post(id: $id) {
    id
    createdAt
    imageUrl
    caption
    author {
      ...UserInfo
    }
    saved
    liked
    likeCount
    comments {
      ...CommentInfo
    }
    commentCount
  }
}
    ${UserInfoFragmentDoc}
${CommentInfoFragmentDoc}`;

export function usePostQuery(options: Omit<Urql.UseQueryArgs<PostQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostQuery>({ query: PostDocument, ...options });
};
export const PostLikesDocument = gql`
    query postLikes($id: String!) {
  post(id: $id) {
    id
    likes {
      likedAt
      author {
        username
        avatarUrl
      }
    }
  }
}
    `;

export function usePostLikesQuery(options: Omit<Urql.UseQueryArgs<PostLikesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostLikesQuery>({ query: PostLikesDocument, ...options });
};
export const PostsByUserDocument = gql`
    query postsByUser($take: Int!, $cursor: String, $username: String!) {
  posts(take: $take, cursor: $cursor, username: $username) {
    posts {
      id
      imageUrl
      likeCount
      commentCount
    }
    hasMore
  }
}
    `;

export function usePostsByUserQuery(options: Omit<Urql.UseQueryArgs<PostsByUserQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostsByUserQuery>({ query: PostsByUserDocument, ...options });
};
export const SavedPostsDocument = gql`
    query savedPosts($take: Int!, $cursor: String) {
  savedPosts(take: $take, cursor: $cursor) {
    posts {
      id
      imageUrl
      likeCount
      commentCount
    }
    hasMore
  }
}
    `;

export function useSavedPostsQuery(options: Omit<Urql.UseQueryArgs<SavedPostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SavedPostsQuery>({ query: SavedPostsDocument, ...options });
};
export const SuggestedUsersDocument = gql`
    query suggestedUsers {
  suggestedUsers {
    ...UserInfo
  }
}
    ${UserInfoFragmentDoc}`;

export function useSuggestedUsersQuery(options: Omit<Urql.UseQueryArgs<SuggestedUsersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SuggestedUsersQuery>({ query: SuggestedUsersDocument, ...options });
};
export const UserDocument = gql`
    query user($id: Int, $username: String) {
  user(id: $id, username: $username) {
    ...UserInfo
    postCount
  }
}
    ${UserInfoFragmentDoc}`;

export function useUserQuery(options: Omit<Urql.UseQueryArgs<UserQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserQuery>({ query: UserDocument, ...options });
};
export type WithTypename<T extends { __typename?: any }> = { [K in Exclude<keyof T, '__typename'>]?: T[K] } & { __typename: NonNullable<T['__typename']> };

export type GraphCacheKeysConfig = {
  Comment?: (data: WithTypename<Comment>) => null | string,
  CreateCommentResponse?: (data: WithTypename<CreateCommentResponse>) => null | string,
  CreatePostResponse?: (data: WithTypename<CreatePostResponse>) => null | string,
  CreateUserResponse?: (data: WithTypename<CreateUserResponse>) => null | string,
  FieldError?: (data: WithTypename<FieldError>) => null | string,
  Like?: (data: WithTypename<Like>) => null | string,
  Post?: (data: WithTypename<Post>) => null | string,
  PostsResponse?: (data: WithTypename<PostsResponse>) => null | string,
  User?: (data: WithTypename<User>) => null | string
}

export type GraphCacheResolvers = {
  Query?: {
    feed?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<Activity> | string>>,
    post?: GraphCacheResolver<WithTypename<Query>, QueryPostArgs, WithTypename<Post> | string>,
    posts?: GraphCacheResolver<WithTypename<Query>, QueryPostsArgs, WithTypename<PostsResponse> | string>,
    savedPosts?: GraphCacheResolver<WithTypename<Query>, QuerySavedPostsArgs, WithTypename<PostsResponse> | string>,
    currentUser?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, WithTypename<User> | string>,
    user?: GraphCacheResolver<WithTypename<Query>, QueryUserArgs, WithTypename<User> | string>,
    suggestedUsers?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<User> | string>>
  },
  Comment?: {
    id?: GraphCacheResolver<WithTypename<Comment>, Record<string, never>, Scalars['ID'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<Comment>, Record<string, never>, Scalars['DateTime'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<Comment>, Record<string, never>, Scalars['DateTime'] | string>,
    text?: GraphCacheResolver<WithTypename<Comment>, Record<string, never>, Scalars['String'] | string>,
    postId?: GraphCacheResolver<WithTypename<Comment>, Record<string, never>, Scalars['String'] | string>,
    author?: GraphCacheResolver<WithTypename<Comment>, Record<string, never>, WithTypename<User> | string>,
    likes?: GraphCacheResolver<WithTypename<Comment>, Record<string, never>, Array<WithTypename<Like> | string>>,
    likeCount?: GraphCacheResolver<WithTypename<Comment>, Record<string, never>, Scalars['Int'] | string>,
    liked?: GraphCacheResolver<WithTypename<Comment>, Record<string, never>, Scalars['Boolean'] | string>
  },
  CreateCommentResponse?: {
    errors?: GraphCacheResolver<WithTypename<CreateCommentResponse>, Record<string, never>, Array<WithTypename<FieldError> | string>>,
    comment?: GraphCacheResolver<WithTypename<CreateCommentResponse>, Record<string, never>, WithTypename<Comment> | string>
  },
  CreatePostResponse?: {
    errors?: GraphCacheResolver<WithTypename<CreatePostResponse>, Record<string, never>, Array<WithTypename<FieldError> | string>>,
    post?: GraphCacheResolver<WithTypename<CreatePostResponse>, Record<string, never>, WithTypename<Post> | string>
  },
  CreateUserResponse?: {
    errors?: GraphCacheResolver<WithTypename<CreateUserResponse>, Record<string, never>, Array<WithTypename<FieldError> | string>>,
    user?: GraphCacheResolver<WithTypename<CreateUserResponse>, Record<string, never>, WithTypename<User> | string>
  },
  FieldError?: {
    field?: GraphCacheResolver<WithTypename<FieldError>, Record<string, never>, Scalars['String'] | string>,
    message?: GraphCacheResolver<WithTypename<FieldError>, Record<string, never>, Scalars['String'] | string>
  },
  Like?: {
    id?: GraphCacheResolver<WithTypename<Like>, Record<string, never>, Scalars['ID'] | string>,
    likedAt?: GraphCacheResolver<WithTypename<Like>, Record<string, never>, Scalars['DateTime'] | string>,
    entityId?: GraphCacheResolver<WithTypename<Like>, Record<string, never>, Scalars['String'] | string>,
    author?: GraphCacheResolver<WithTypename<Like>, Record<string, never>, WithTypename<User> | string>
  },
  Post?: {
    id?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, Scalars['ID'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, Scalars['DateTime'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, Scalars['DateTime'] | string>,
    caption?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, Scalars['String'] | string>,
    imageUrl?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, Scalars['String'] | string>,
    author?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, WithTypename<User> | string>,
    comments?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, Array<WithTypename<Comment> | string>>,
    likes?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, Array<WithTypename<Like> | string>>,
    likeCount?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, Scalars['Int'] | string>,
    liked?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, Scalars['Boolean'] | string>,
    saved?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, Scalars['Boolean'] | string>,
    commentsPreview?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, Array<WithTypename<Comment> | string>>,
    commentCount?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, Scalars['Int'] | string>
  },
  PostsResponse?: {
    posts?: GraphCacheResolver<WithTypename<PostsResponse>, Record<string, never>, Array<WithTypename<Post> | string>>,
    hasMore?: GraphCacheResolver<WithTypename<PostsResponse>, Record<string, never>, Scalars['Boolean'] | string>
  },
  User?: {
    id?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['ID'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['DateTime'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['DateTime'] | string>,
    email?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>,
    username?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>,
    avatarUrl?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>,
    postCount?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['Int'] | string>
  }
};

export type GraphCacheOptimisticUpdaters = {
  createComment?: GraphCacheOptimisticMutationResolver<MutationCreateCommentArgs, WithTypename<CreateCommentResponse>>,
  updateComment?: GraphCacheOptimisticMutationResolver<MutationUpdateCommentArgs, WithTypename<CreateCommentResponse>>,
  deleteComment?: GraphCacheOptimisticMutationResolver<MutationDeleteCommentArgs, WithTypename<CreateCommentResponse>>,
  like?: GraphCacheOptimisticMutationResolver<MutationLikeArgs, Scalars['Boolean']>,
  removeLike?: GraphCacheOptimisticMutationResolver<MutationRemoveLikeArgs, Scalars['Boolean']>,
  createPost?: GraphCacheOptimisticMutationResolver<MutationCreatePostArgs, WithTypename<CreatePostResponse>>,
  updatePost?: GraphCacheOptimisticMutationResolver<MutationUpdatePostArgs, WithTypename<CreatePostResponse>>,
  deletePost?: GraphCacheOptimisticMutationResolver<MutationDeletePostArgs, WithTypename<CreatePostResponse>>,
  savePost?: GraphCacheOptimisticMutationResolver<MutationSavePostArgs, Scalars['Boolean']>,
  removeSavedPost?: GraphCacheOptimisticMutationResolver<MutationRemoveSavedPostArgs, Scalars['Boolean']>,
  register?: GraphCacheOptimisticMutationResolver<MutationRegisterArgs, WithTypename<CreateUserResponse>>,
  login?: GraphCacheOptimisticMutationResolver<MutationLoginArgs, WithTypename<CreateUserResponse>>,
  logout?: GraphCacheOptimisticMutationResolver<Record<string, never>, Scalars['Boolean']>,
  updateProfilePic?: GraphCacheOptimisticMutationResolver<MutationUpdateProfilePicArgs, WithTypename<User>>,
  removeProfilePic?: GraphCacheOptimisticMutationResolver<Record<string, never>, WithTypename<User>>
};

export type GraphCacheUpdaters = {
  Mutation?: {
    createComment?: GraphCacheUpdateResolver<{ createComment: WithTypename<CreateCommentResponse> }, MutationCreateCommentArgs>,
    updateComment?: GraphCacheUpdateResolver<{ updateComment: WithTypename<CreateCommentResponse> }, MutationUpdateCommentArgs>,
    deleteComment?: GraphCacheUpdateResolver<{ deleteComment: WithTypename<CreateCommentResponse> }, MutationDeleteCommentArgs>,
    like?: GraphCacheUpdateResolver<{ like: Scalars['Boolean'] }, MutationLikeArgs>,
    removeLike?: GraphCacheUpdateResolver<{ removeLike: Scalars['Boolean'] }, MutationRemoveLikeArgs>,
    createPost?: GraphCacheUpdateResolver<{ createPost: WithTypename<CreatePostResponse> }, MutationCreatePostArgs>,
    updatePost?: GraphCacheUpdateResolver<{ updatePost: WithTypename<CreatePostResponse> }, MutationUpdatePostArgs>,
    deletePost?: GraphCacheUpdateResolver<{ deletePost: WithTypename<CreatePostResponse> }, MutationDeletePostArgs>,
    savePost?: GraphCacheUpdateResolver<{ savePost: Scalars['Boolean'] }, MutationSavePostArgs>,
    removeSavedPost?: GraphCacheUpdateResolver<{ removeSavedPost: Scalars['Boolean'] }, MutationRemoveSavedPostArgs>,
    register?: GraphCacheUpdateResolver<{ register: WithTypename<CreateUserResponse> }, MutationRegisterArgs>,
    login?: GraphCacheUpdateResolver<{ login: WithTypename<CreateUserResponse> }, MutationLoginArgs>,
    logout?: GraphCacheUpdateResolver<{ logout: Scalars['Boolean'] }, Record<string, never>>,
    updateProfilePic?: GraphCacheUpdateResolver<{ updateProfilePic: WithTypename<User> }, MutationUpdateProfilePicArgs>,
    removeProfilePic?: GraphCacheUpdateResolver<{ removeProfilePic: WithTypename<User> }, Record<string, never>>
  },
  Subscription?: {},
};

export type GraphCacheConfig = {
  schema?: IntrospectionData,
  updates?: GraphCacheUpdaters,
  keys?: GraphCacheKeysConfig,
  optimistic?: GraphCacheOptimisticUpdaters,
  resolvers?: GraphCacheResolvers,
  storage?: GraphCacheStorageAdapter
};