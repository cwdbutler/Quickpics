<div align="center">

# Quickpics Web App

# https://www.quickpics.app

# Contents:

## [Overview](#overview) | [Deployment Process](#deployment-process) | [Server Side Rendering](#server-side-rendering) | [Cache Management](#cache-management) | [Improvements](#improvements)

</div>

#

![Infrastructure diagram](https://i.gyazo.com/b961784de73be6cb76a30f8727b589c3.png)

# Overview

## Key Features:

- Completely single page - 0 refreshes
- Server side rendering
- Infinite scroll pagination
- Replicates Instagram UI and UX
- Image editing
- Image upload validation
- Sign up and login up with validation
- Saving posts to your account
- Creating posts and commenting on them
- Responsive design
- Optimised Images using Nextjs Image component

For the technology I am using Next.js with TailwindCSS for styling, and [Urql](https://github.com/FormidableLabs/urql) client to make GraphQL requests and manage the cache using its [Graphcache](https://formidable.com/open-source/urql/docs/graphcache/) module. I used various small react libraries and tweaked them to fit the features I was aiming for, for example the create a post form is a combination of [react-dropzone](https://github.com/react-dropzone/react-dropzone) to handle drag and drop, for which I wrote my own file validation function, and [react-easy-crop](https://github.com/ricardo-ch/react-easy-crop) for the image cropper which required a lot of editing because it doesn't handle the cropping for you. I adapted an example they made to be TypeScript compatible and then reused what I learned about creating a new edited image with HTML canvas for the Image Editor component, which just uses CSS filters and then makes a new image with those applied using the [.filter](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter) property of the canvas API.

Additionally, [GraphQL Code Generator](https://www.graphql-code-generator.com/) sped up my development time immensely, as it generates types and hooks that use Urql client, by running the queries I define in [/graphql](https://github.com/ConorButler/Quickpics/tree/main/client/src/graphql) against the url in [codegen.yml](https://github.com/ConorButler/Quickpics/blob/main/client/codegen.yml). Defining the types myself would have involved a lot of code duplication, and I made my own hooks in my last [React project](https://github.com/ConorButler/mealstack-frontend/tree/main/src/hooks) for a REST API so I already have an understanding of writing custom hooks to call an API.

I didn't originally plan to clone Instagram - I knew I wanted to do some sort of image sharing site, but I quickly realised designing a website is not my forte, and I ended up looking at Instagram for inspiration. I made the decision to just clone it as accurately as possible for 2 reasons; firstly it gives me practice building a UI/UX to fit an existing design system, improving my attention to detail, and secondly freed up my brain and allowed me to focus on the logic of implementing the features instead of designing them. With that said, I now have a new admiration for UX designers and have come to appreciate the little things Instagram implements to make their user's lives a bit easier - often without you even noticing. One of these thigns is the sign up form, which I tried to recreate at /register.

# Deployment Process

Deploying this app is very simple, it just involves pushing to main as AWS Amplify has automatic deploys set up from this branch, that detects any changes in the /client directory. Setting it up was also straightforward and was basically one click. I chose not go with Vercel because this app makes heavy use of the [Next.js Image component](https://nextjs.org/docs/api-reference/next/image), and the way they outlined the cost for these optimisations wasn't very clear. I was curious about other ways to deploy a Next.js app - I thought about deploying this to my VPS in another container alongside the backend. Dokku actually supports this easily as you can create multiple "apps" and just expose them on different ports. However I chose not do this as a) I was worried it would put too much load on the server, and b) I didn't know if the Next.js features would work optimally. In the end I found that it was between [AWS Amplify](https://aws.amazon.com/amplify/) and [serverless-next.js](https://github.com/serverless-nextjs/serverless-next.js) and I chose AWS to gain a bit more knowledge into how the platform works and made an effort to try and understand how the infrastructure was working under the hood, as outlined in the diagram above.

# Server Side Rendering

One of the biggest challenges for this project was getting to grips with Server Side Rendering. The [next-urql](https://www.npmjs.com/package/next-urql) package was really useful here and had great documentation for setting up the Urql client in such a way that you could turn SSR on or off for specific pages just by wrapping each page in a higher order component which took in your Urql config, and then passing in { ssr: true } to enable SSR. Still, there were multiple cases where doing this alone wasn't enough. One of them being the post page, which takes the post id from the params and then immediately tries to find posts by that user. This causes a problem if the id params don't match an existing post, as it tries to find _undefined_'s user id and throws a bunch of errors, so I had to check for the post using getServerSideProps() - the standard way to invoke SSR in Nextjs. This got even more complicated in the [user profile page and the /saved page](https://github.com/ConorButler/Quickpics/tree/main/client/src/pages/%5Busername%5D) (called \[detail] in case I want to add other params here). It involved checking if the url username params were a real user, then displaying their posts, and then on the saved page doing the same thing but only if the current user is the owner of this profile. This was quite the challenge and also required forwarding the session cookie server-side as this isn't done automatically.

# Cache Management

When building this app, I didn't want the page to refresh at any point and interrupt the user experience. This goal was definitely achieved, everything the user does is updated across all pages they have visited in their browsing session, and even when they log out everything updates instantly and accurately. This required meticulously managing the cache using Urql GraphCache's cache exchange module, which happens in [urqlClient.ts](https://github.com/ConorButler/Quickpics/blob/main/client/src/urqlClient.ts). I spent far more time than I would like to trying to grapple with this configuration. Essentially, Urql caches things for you automatically which is usually a good thing; it stops unnecessary duplicate queries, it's good for storing things like the current user on the first page load and not having to use something like the React useContext API, however it quickly become obvious that it affected the single page experience. For example, when you log in or register, it doesn't update the currentUser query because it doesn't know they are related. Often times Urql is clever enough to realise and updates things automatically; an example of this can be seen below when a user updates their profile picture:

![Cache demo](https://i.gyazo.com/a55dc363a92894f239b1cf526c484291.gif)

As you can see, Urql recognises that the url for this specific user's avatarUrl property has changed, so finds every instance of that user in the cache and updates it, whether that is on a comment, a post header, the navbar, or the profile page. This is because when the picture is updated, I make sure it returns the new updated avatarUrl which allows Urql to recognise the change. Most of the time this doesn't happen though, so every time I added a feature I had to add a rule to tell Urql how to update the cache, and you can see there are a lot of these rules.

Here are some examples of ways you can update the cache with Urql:

- Invalidating queries e.g. creating a new post invalides the posts query for the homepage
- Updating a query e.g. when logging in update the currentUser query with the logged in user
- Finding all previous queries of a certain type and updating them e.g. when logging in or out, each individual "post" query is invalidated so that it accurately reflects if you have liked or saved it
- Updating individual fields e.g. when liking or unliking a post, if the response is successful it changes the liked field on that post correspondingly (and thus the colour of the heart icon).

# Improvements

I think if I had an understanding of the more advanced hooks or some alternative solutions to state management such as Redux I could have solved things in a cleaner and more performant way. An example would be trying to get clicking the comment icon on the post page to focus the comment form input. These are sibling components, so useRef doesn't work without using a forward ref - which I couldn't get my head around. What I ended up doing was just sharing some state with the parent (post page in pages/[id].tsx) in the form of a counter and implementing the counter on click, and then using useEffect to monitor that change and focus the form input. A very messy workaround, and I think I need to build more simple features but using better practice to get a firmer grasp on the fundamentals. I also could have given refactoring more attention during the development process. In many cases I shyed away from refactoring things out into atomic components because it would make state management harder, and mean I'd have to set up and pass down a lot more props - which then had to be typed and so on. There are some components such as the combination of a user's profile picture and their name that should be extracted and reused.

In terms of deployment, AWS Amplify doesn't seem to be optimising images properly, as confirmed by [this issue](https://github.com/aws-amplify/amplify-console/issues/2392) on GitHub. It is making my doubt my choice to use it over Vercel as the image loading is noticeable in production. I tested a deployment to Vercel and the images loaded noticeably faster and in the optimised .webp format, although at a slightly slower initial page load. Regardless, I don't regret venturing into the world of AWS one step further and learning some more about serverless infrastructure.
