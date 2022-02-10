// import { createUnionType } from "type-graphql";
// import { Post } from "./Post";

// unused feature; was planning to have a feed of all activity

// export const ActivityUnion = createUnionType({
//   name: "Activity", // the name of the GraphQL union
//   types: () => [Post] as const, // will also contain comments soon
//   // detecting returned object type
//   resolveType: (value) => {
//     if ("caption" in value) {
//       return Post; // return the relevant `@ObjectType()`
//     }
//     return undefined;
//   },
// });
