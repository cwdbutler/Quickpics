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

export type Mutation = {
  __typename?: 'Mutation';
  createPost: CreatePostResponse;
  deletePost: CreatePostResponse;
  login: CreateUserResponse;
  logout: Scalars['Boolean'];
  register: CreateUserResponse;
  updatePost: CreatePostResponse;
};


export type MutationCreatePostArgs = {
  caption: Scalars['String'];
  file: Scalars['Upload'];
};


export type MutationDeletePostArgs = {
  id: Scalars['String'];
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


export type MutationUpdatePostArgs = {
  caption: Scalars['String'];
  id: Scalars['String'];
};

export type Post = {
  __typename?: 'Post';
  author: User;
  caption?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  imageUrl: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type PostsResponse = {
  __typename?: 'PostsResponse';
  hasMore: Scalars['Boolean'];
  posts: Array<Post>;
};

export type Query = {
  __typename?: 'Query';
  allPosts: PostsResponse;
  currentUser?: Maybe<User>;
  feed: Array<Activity>;
  post?: Maybe<Post>;
  user?: Maybe<User>;
};


export type QueryAllPostsArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  take: Scalars['Int'];
};


export type QueryPostArgs = {
  id: Scalars['String'];
};


export type QueryUserArgs = {
  id: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  avatarUrl?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['ID'];
  updatedAt: Scalars['DateTime'];
  username: Scalars['String'];
};

export type PostWithAuthorFragment = { __typename?: 'Post', id: string, imageUrl: string, caption?: string | null | undefined, createdAt: any, updatedAt: any, author: { __typename?: 'User', id: string, username: string, avatarUrl?: string | null | undefined } };

export type UserInfoFragment = { __typename?: 'User', id: string, username: string, avatarUrl?: string | null | undefined };

export type CreatePostMutationVariables = Exact<{
  caption: Scalars['String'];
  file: Scalars['Upload'];
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'CreatePostResponse', post?: { __typename?: 'Post', id: string, caption?: string | null | undefined, imageUrl: string } | null | undefined } };

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

export type AllPostsQueryVariables = Exact<{
  take: Scalars['Int'];
  cursor?: InputMaybe<Scalars['String']>;
}>;


export type AllPostsQuery = { __typename?: 'Query', allPosts: { __typename?: 'PostsResponse', hasMore: boolean, posts: Array<{ __typename?: 'Post', id: string, imageUrl: string, caption?: string | null | undefined, createdAt: any, updatedAt: any, author: { __typename?: 'User', id: string, username: string, avatarUrl?: string | null | undefined } }> } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, username: string, avatarUrl?: string | null | undefined } | null | undefined };

export const UserInfoFragmentDoc = gql`
    fragment UserInfo on User {
  id
  username
  avatarUrl
}
    `;
export const PostWithAuthorFragmentDoc = gql`
    fragment PostWithAuthor on Post {
  id
  imageUrl
  caption
  createdAt
  updatedAt
  author {
    ...UserInfo
  }
}
    ${UserInfoFragmentDoc}`;
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
export const AllPostsDocument = gql`
    query allPosts($take: Int!, $cursor: String) {
  allPosts(take: $take, cursor: $cursor) {
    posts {
      ...PostWithAuthor
    }
    hasMore
  }
}
    ${PostWithAuthorFragmentDoc}`;

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
export type WithTypename<T extends { __typename?: any }> = { [K in Exclude<keyof T, '__typename'>]?: T[K] } & { __typename: NonNullable<T['__typename']> };

export type GraphCacheKeysConfig = {
  CreatePostResponse?: (data: WithTypename<CreatePostResponse>) => null | string,
  CreateUserResponse?: (data: WithTypename<CreateUserResponse>) => null | string,
  FieldError?: (data: WithTypename<FieldError>) => null | string,
  Post?: (data: WithTypename<Post>) => null | string,
  PostsResponse?: (data: WithTypename<PostsResponse>) => null | string,
  User?: (data: WithTypename<User>) => null | string
}

export type GraphCacheResolvers = {
  Query?: {
    feed?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<Activity> | string>>,
    post?: GraphCacheResolver<WithTypename<Query>, QueryPostArgs, WithTypename<Post> | string>,
    allPosts?: GraphCacheResolver<WithTypename<Query>, QueryAllPostsArgs, WithTypename<PostsResponse> | string>,
    currentUser?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, WithTypename<User> | string>,
    user?: GraphCacheResolver<WithTypename<Query>, QueryUserArgs, WithTypename<User> | string>
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
  Post?: {
    id?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, Scalars['ID'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, Scalars['DateTime'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, Scalars['DateTime'] | string>,
    caption?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, Scalars['String'] | string>,
    imageUrl?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, Scalars['String'] | string>,
    author?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, WithTypename<User> | string>
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
    avatarUrl?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>
  }
};

export type GraphCacheOptimisticUpdaters = {
  createPost?: GraphCacheOptimisticMutationResolver<MutationCreatePostArgs, WithTypename<CreatePostResponse>>,
  updatePost?: GraphCacheOptimisticMutationResolver<MutationUpdatePostArgs, WithTypename<CreatePostResponse>>,
  deletePost?: GraphCacheOptimisticMutationResolver<MutationDeletePostArgs, WithTypename<CreatePostResponse>>,
  register?: GraphCacheOptimisticMutationResolver<MutationRegisterArgs, WithTypename<CreateUserResponse>>,
  login?: GraphCacheOptimisticMutationResolver<MutationLoginArgs, WithTypename<CreateUserResponse>>,
  logout?: GraphCacheOptimisticMutationResolver<Record<string, never>, Scalars['Boolean']>
};

export type GraphCacheUpdaters = {
  Mutation?: {
    createPost?: GraphCacheUpdateResolver<{ createPost: WithTypename<CreatePostResponse> }, MutationCreatePostArgs>,
    updatePost?: GraphCacheUpdateResolver<{ updatePost: WithTypename<CreatePostResponse> }, MutationUpdatePostArgs>,
    deletePost?: GraphCacheUpdateResolver<{ deletePost: WithTypename<CreatePostResponse> }, MutationDeletePostArgs>,
    register?: GraphCacheUpdateResolver<{ register: WithTypename<CreateUserResponse> }, MutationRegisterArgs>,
    login?: GraphCacheUpdateResolver<{ login: WithTypename<CreateUserResponse> }, MutationLoginArgs>,
    logout?: GraphCacheUpdateResolver<{ logout: Scalars['Boolean'] }, Record<string, never>>
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