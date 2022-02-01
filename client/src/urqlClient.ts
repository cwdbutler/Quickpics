import { dedupExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { multipartFetchExchange } from "@urql/exchange-multipart-fetch";
import {
  GraphCacheConfig,
  CurrentUserDocument,
} from "./graphql/generated/graphql";

export const urqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include",
  } as const,
  exchanges: [
    dedupExchange, // prevents duplication of queries
    cacheExchange<GraphCacheConfig>({
      keys: {
        PostsResponse: () => null,
        User: () => null,
      }, // urql needs a key for each response, and returning null forces it to look at posts for one
      updates: {
        Mutation: {
          login: (result, _args, cache, _info) => {
            // Document = a GraphQL request generated by graphql-codegen
            cache.updateQuery({ query: CurrentUserDocument }, (data) => {
              if (result.login.errors) {
                // if bad login, just return the currently cached currentUser
                return data;
              } else {
                // set the currentUser to the logged in user
                return {
                  __typename: "User",
                  currentUser: {
                    ...result.login.user,
                  },
                };
              }
            });
          },
          register: (result, _args, cache, _info) => {
            cache.updateQuery({ query: CurrentUserDocument }, (data) => {
              if (result.register.errors) {
                return data;
              } else {
                return {
                  __typename: "User",
                  currentUser: {
                    ...result.register.user,
                  },
                };
              }
            });
          },
          logout: (result, _args, cache, _info) => {
            // when log out request sent, clear the currentUser
            cache.updateQuery({ query: CurrentUserDocument }, (data) => {
              if (result.logout) {
                return { __typename: "User", currentUser: null };
              }
              return data;
            });
          },
          createPost: (result, _args, cache, _info) => {
            // refetches allPosts when a new post is made
            cache.invalidate("Query", "allPosts", {
              take: 10,
            }); // for some reason cursor: null doesn't work
          },
        },
      },
    }),
    ssrExchange,
    multipartFetchExchange,
  ],
});
