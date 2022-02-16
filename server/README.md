<div align="center">

# Quickpics API

# https://api.quickpics.app/graphql

# Contents:

## [Overview](#overview) | [Tests](#tests) | [Deployment Process](#deployment-process) | [Database](#database) | [Using the API](#using-the-api) | [Improvements](#improvements)

</div>

#

![Infrastructure diagram](https://i.gyazo.com/5c91cd72fd315f66e0035f964c4e8671.png)

# Overview

## API Key Features:

- 80+ integration tests
- Authentication (express session and Redis + BCrypt hashed passwords)
- Authorisation
- Validation
- Automatic file upload and deletion from AWS
- Nested relationships queriable (e.g. Post=>comments->author)
- Aggregation fields (postCount, likeCount)
- Pagination on posts and saved posts
- Optional user argument on posts

One of my main goals for this project was to learn TypeScript and try out using a GraphQL API. I used [TypeGraphQL](https://github.com/MichalLytek/type-graphql) to build the schema using a code-first approach. The learning curve was steep initially as the decorator-heavy syntax was quite overwhelming, but after getting used to it I found it very intuitive (or at least the simpler features I was using were). [Apollo server](https://github.com/apollographql/apollo-server) was a no brainer here as it seemed to be the most popular choice, and can use apollo-express to use Express middleware I am used to such as [express-session](https://github.com/expressjs/session), with which I used [connect-redis](https://github.com/tj/connect-redis) to use a Redis database for super fast user session storage. I then used PostgresQL because it is good for modelling relational data (I initially wanted to implement every part of Instagram including followers) and [Prisma ORM](https://github.com/prisma/prisma) as it was a pleasure to work with in my last project and the documentation is great, however this time I did run into a few of it's limitations as described in the [Database Schema](#database-schema) section below. Another goal was to learn about handling images and sending them across the web. That was definitely more difficult client side as here on the server [graphql-upload](https://github.com/jaydenseric/graphql-upload) and AWS SDK abstracted things quite a bit - except for when it came to testing. The images are stored in an AWS S3 Bucket which I made publically accessible for GET requests, but only my IAM verified user (this application) can do PUT POST and DELETE. I also use a separate bucket for testing as to avoid confusion, but most of the data in the development environment is seeded using the [seed file](https://github.com/ConorButler/Quickpics/blob/main/server/prisma/seed.ts) using stock images.

# Tests

I've written tests which run GraphQL requests against the API. I do not mock prisma or test any code logic invidiually for complexity's sake, but I've made my best attempts to make the tests high quality.
For instance I mocked the call to AWS when uploading a file, and wipe the test database after each testing suite. For testing sessions I just pass in a mock session object with a user id. I tried to be as thorough as possible with regards to edge cases; some examples include forbidden usernames that match routes in the Nextjs app and testing all paths for requests that involve authenticatin or authorisation, as shown below:

![All tests](https://i.gyazo.com/6865b9c0015c98633c8313a5d330b7d3.png)

![User](https://i.gyazo.com/5e98b451ae7a385f4c0566e60d265da3.png)

![Post](https://i.gyazo.com/ec98fe081a19114cb2a28ad01326e829.png)

![Comment](https://i.gyazo.com/9c64047fd03e428ec77b803402f45f97.png)

![Like](https://i.gyazo.com/3ea2bbfd174e265e6d924625437949a8.png)

# Deployment Process

![Deployment](https://i.gyazo.com/9b98116f29213d60810c6591b13375ef.png)

[Docker Hub Repository](https://hub.docker.com/repository/docker/cwdb/quickpics-api) to view the build history (there were a lot more builds before this; this is the first stable one)

I learned a lot deploying through this approach, including some things about DNS as I used a custom domain. Running my own VPS and using [Dokku](https://dokku.com/), which was really easy to work with, gave me a lot of insight into other methods of deployment and the web in general, especially compared to previous deploys I had been doing on platforms such as Heroku, and others which were pretty much 1 click deploys like Netlify.

I ran into a few small problems, the first being that the hosting provider I was using, Vultr, seemed to block port 80 with Uncomplicated Firewall (UFW) by default. This was extremely frustrating because it wasn't specified anywhere, and it seemed I had done everything right according to the Dokku documentation but the IP address just wasn't responding to anything. Another problem was that nginx, which Dokku configures automatically, had been set to max request body size of 2MB, which conflicted with my max 5mb file upload set both client side and in the API code via GraphQL Upload. Again this took some debugging but the Dokku documentation and GitHub issues were of great help here.

# Database

![Schema](https://i.gyazo.com/48ef2975a5e12bb7593342e7439ca29e.png)

One thing I tried to be conscious of is which columns in the database are exposed as fields in the GraphQL schema. I handle this through TypeGraphQl in [src/graphql/types](https://github.com/ConorButler/Quickpics/tree/main/server/src/graphql/types). Essentially, everything marked with @Field() is exposed by the API. It doesn't have to line up exactly with the database schema - for example there is no Posts or UsersOnPosts in User.ts. There is no situation where you can see a user and all of their comments, so that isn't exposed on User, and a user's post are handled in the Post resolver which saves another SQL query as each time you return an object, it must include _all_ of the fields described in the @ObjectType. This was quite a hindrance sometimes and there are some unnecessary queries being done to the database - luckily this light years away from needing to worry about optimisation, but it was something I noticed. Of course, you don't ever want to expose any password information so passwordHash is omitted, but for email the situation is different; only you should be able to see your own email (if I added a profile settings page let's say), so that is handled via a Field Resolver. Field Resolvers come in very useful for likes, because as I'll explain in the next paragraph neither Postgres or Prisma know that a like is related to anything.

Originally I wasn't set on cloning Instagram and was going to have a Facebook like feed of user "Activity", i.e. likes, posts, and comments all in a list, and realised I needed to implement some sort of polymorphic relationship - and Prisma doesn't support this. I had got the idea for Activity from the suggestions in [this GitHub issue](https://github.com/prisma/prisma/issues/2505). Esentially the official Prisma recommended solution involves neither the database or the ORM having knowledge of the polymorphic relationship, which makes for some very complicated queries and having to .map over the results in some cases, and what I ended up doing was creating an Activity each time a Post, Like, or Comment was made as suggested in that thread. Specifically this was achieved by creating a string id - I chose [nanoid](https://github.com/ai/nanoid) for nice and short urls - and then giving the same id to the Activity. Fortunately I kept this Activity system in place as later on when it came to implementing likes this came in useful again, as both posts and comments are likeable, but are both still in the Activity table; Like has a polymorphic relationship with Post and Comment - what I had already done with Activity made liking an "Entity" really easy:

```
mutation {
  like(entityId: "PostOrCommentIDhere")
}
// returns true or false depending on if the like was successful
```

I chose to omit error information here as the front end does a lot of things to represent and control the liked state. Furthermore a Field Resolver that I had to implement for the Like model was the "liked" field which returns a boolean showing if the current user has liked this post. The same goes for saved posts. These fields are probably doing some overkill SQL queries under the hood, but this information was incredibly useful in front end and prevented having to do something like request all of the likes every time and see if the current user is in that array client side.

# Using The API

I've left the GraphQL playground up in production so it is easy to query, and it is mostly self documenting. If you are unfamiliar with GraphQL playground, click on "Docs" on the right. This will give you a list of all the queries and mutations you can make, their arguments (if any), and the types they return and thus the fields you can query. You can use ctrl/cmd + space for some useful autocompletion.

A quick demo:

![Demo](https://i.gyazo.com/9a51c7afa202dccb9a448cc4c6002ace.gif)

If you wish to make authentication related queries make sure to go to the settings in the top right and change the following line to "include" in order to receive and send cookies:

![Credentials include](https://i.gyazo.com/9349a38d6789dc3f58f763b0d4c3fbe1.png)

Of course you can use the documentation here to query the API using your method/application of choice

# Improvements

As mentioned above, there were many more features I still want to implement, but I'm slowing down production for now. Some of which the API actually supports and I haven't set up in the front end to stay accurate to the real Instagram; editing posts, editing comments, and others I have decent of idea how to implement but would take more time; better user profiles (bios, updating/deleting accounts), comment replies. Followers would be fun to set up but it would take a lot more data to work effectively and S3 isn't free :). I would also like to try using GraphQL subscriptions for features like showing an indicator on the navbar when someone likes your post, or one on the feed when a new post has been made. I'm happy with what I have done so far though and am confident my ability to expand on this project because it is well tested and moderately clean code although there could be some improvements on the latter.
