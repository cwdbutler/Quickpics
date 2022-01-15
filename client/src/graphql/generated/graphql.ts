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
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: PostResponse;
  deletePost: PostResponse;
  login: UserResponse;
  register: UserResponse;
  updatePost: PostResponse;
};


export type MutationCreatePostArgs = {
  caption: Scalars['String'];
};


export type MutationDeletePostArgs = {
  id: Scalars['Int'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationRegisterArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationUpdatePostArgs = {
  caption: Scalars['String'];
  id: Scalars['Int'];
};

export type Post = {
  __typename?: 'Post';
  caption?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  updatedAt: Scalars['DateTime'];
};

export type PostResponse = {
  __typename?: 'PostResponse';
  errors?: Maybe<Array<FieldError>>;
  post?: Maybe<Post>;
};

export type Query = {
  __typename?: 'Query';
  currentUser?: Maybe<User>;
  post?: Maybe<Post>;
  posts: Array<Post>;
  user?: Maybe<User>;
};


export type QueryPostArgs = {
  id: Scalars['Int'];
};


export type QueryUserArgs = {
  id: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  updatedAt: Scalars['DateTime'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: string, username: string } | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: string, username: string } | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, username: string } | null | undefined };


export const LoginDocument = gql`
    mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    user {
      id
      username
    }
    errors {
      field
      message
    }
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const RegisterDocument = gql`
    mutation register($username: String!, $password: String!) {
  register(username: $username, password: $password) {
    user {
      id
      username
    }
    errors {
      field
      message
    }
  }
}
    `;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const CurrentUserDocument = gql`
    query currentUser {
  currentUser {
    id
    username
  }
}
    `;

export function useCurrentUserQuery(options: Omit<Urql.UseQueryArgs<CurrentUserQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CurrentUserQuery>({ query: CurrentUserDocument, ...options });
};
export type WithTypename<T extends { __typename?: any }> = { [K in Exclude<keyof T, '__typename'>]?: T[K] } & { __typename: NonNullable<T['__typename']> };

export type GraphCacheKeysConfig = {
  FieldError?: (data: WithTypename<FieldError>) => null | string,
  Post?: (data: WithTypename<Post>) => null | string,
  PostResponse?: (data: WithTypename<PostResponse>) => null | string,
  User?: (data: WithTypename<User>) => null | string,
  UserResponse?: (data: WithTypename<UserResponse>) => null | string
}

export type GraphCacheResolvers = {
  Query?: {
    post?: GraphCacheResolver<WithTypename<Query>, QueryPostArgs, WithTypename<Post> | string>,
    posts?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<Post> | string>>,
    currentUser?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, WithTypename<User> | string>,
    user?: GraphCacheResolver<WithTypename<Query>, QueryUserArgs, WithTypename<User> | string>
  },
  FieldError?: {
    field?: GraphCacheResolver<WithTypename<FieldError>, Record<string, never>, Scalars['String'] | string>,
    message?: GraphCacheResolver<WithTypename<FieldError>, Record<string, never>, Scalars['String'] | string>
  },
  Post?: {
    id?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, Scalars['ID'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, Scalars['DateTime'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, Scalars['DateTime'] | string>,
    caption?: GraphCacheResolver<WithTypename<Post>, Record<string, never>, Scalars['String'] | string>
  },
  PostResponse?: {
    errors?: GraphCacheResolver<WithTypename<PostResponse>, Record<string, never>, Array<WithTypename<FieldError> | string>>,
    post?: GraphCacheResolver<WithTypename<PostResponse>, Record<string, never>, WithTypename<Post> | string>
  },
  User?: {
    id?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['ID'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['DateTime'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['DateTime'] | string>,
    username?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>
  },
  UserResponse?: {
    errors?: GraphCacheResolver<WithTypename<UserResponse>, Record<string, never>, Array<WithTypename<FieldError> | string>>,
    user?: GraphCacheResolver<WithTypename<UserResponse>, Record<string, never>, WithTypename<User> | string>
  }
};

export type GraphCacheOptimisticUpdaters = {
  createPost?: GraphCacheOptimisticMutationResolver<MutationCreatePostArgs, WithTypename<PostResponse>>,
  updatePost?: GraphCacheOptimisticMutationResolver<MutationUpdatePostArgs, WithTypename<PostResponse>>,
  deletePost?: GraphCacheOptimisticMutationResolver<MutationDeletePostArgs, WithTypename<PostResponse>>,
  register?: GraphCacheOptimisticMutationResolver<MutationRegisterArgs, WithTypename<UserResponse>>,
  login?: GraphCacheOptimisticMutationResolver<MutationLoginArgs, WithTypename<UserResponse>>
};

export type GraphCacheUpdaters = {
  Mutation?: {
    createPost?: GraphCacheUpdateResolver<{ createPost: WithTypename<PostResponse> }, MutationCreatePostArgs>,
    updatePost?: GraphCacheUpdateResolver<{ updatePost: WithTypename<PostResponse> }, MutationUpdatePostArgs>,
    deletePost?: GraphCacheUpdateResolver<{ deletePost: WithTypename<PostResponse> }, MutationDeletePostArgs>,
    register?: GraphCacheUpdateResolver<{ register: WithTypename<UserResponse> }, MutationRegisterArgs>,
    login?: GraphCacheUpdateResolver<{ login: WithTypename<UserResponse> }, MutationLoginArgs>
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