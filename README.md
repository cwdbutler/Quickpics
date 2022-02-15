<div align="center" >

# A full stack, single page, server side rendered Instagram clone

## Users can sign up and edit image posts, and then like, comment, and save them

## Check each directory's README for more detail

#

# Live App • https://www.quickpics.app • [README](https://github.com/ConorButler/Quickpics/tree/main/client)

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

# Server/API • https://api.quickpics.app/graphql • [README](https://github.com/ConorButler/Quickpics/blob/main/server/README.md)

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Apollo-GraphQL](https://img.shields.io/badge/-ApolloGraphQL-311C87?style=for-the-badge&logo=apollo-graphql)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Type-graphql](https://img.shields.io/badge/-TypeGraphQL-%23C04392?style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

## [Docker image (API)](https://hub.docker.com/layers/cwdb/quickpics-api/1.0/images/sha256-1691eb52eb98e2a92ce329a2ac74022517f98181b650c4ba9c0be3d084a89ef9)

#

# Aims to replicate the key features of Instagram, down to the finer UX details, here are some examples:

</div>

<div align="center">
  <h2>Editing images (with upload validation)</h2>
  <div style="display: flex; align-items: center; justify-content: center;">
    <div>
    <img src="https://i.gyazo.com/4401607c94bab1ed41db91cc82487de0.gif">
    </div>
    <div>
    <img src="https://i.gyazo.com/72b2ed3a5794c96d35f8aa23ac4458c7.gif">
    </div>
    <div>
    <img src="https://i.gyazo.com/4c14cbb1ecddfd4651227cfe496d1829.gif">
    </div>
  </div>
  <h2>Infinite scroll pagination</h2>
  <div style="display: flex; align-items: center; justify-content: center;">
    <div>
      <img src="https://i.gyazo.com/1b3eef3b93f4fb2ab5ceacb6d8025390.gif">
    </div>
    <div>
    <img src="https://i.gyazo.com/b8cce90cb621c480ff9bd82d8ad76e43.gif">
    </div>
    <div>
    <img src="https://i.gyazo.com/a2ca970c8739d86b619aa37437179c52.gif">
    </div>
  </div>
  <h2>Register validations</h2>
  <div style="display: flex; align-items: center; justify-content: center;">
  <div>
    <img src="https://i.gyazo.com/9f7676c5bf6167d3ac219be3fc1a4c07.gif">
  </div>
    <div>
    <img src="https://i.gyazo.com/b8cce90cb621c480ff9bd82d8ad76e43.gif">
    </div>
    <div>
    <img src="https://i.gyazo.com/a2ca970c8739d86b619aa37437179c52.gif">
    </div>
  </div>
    <h2>Responsive design</h2>
    <div style="display: flex; align-items: center; justify-content: center;">
    <div>
      <img src="https://i.gyazo.com/caafe3f7c24d8dc9b391015b54989206.gif">
    </div>
    <div>
    <img src="https://i.gyazo.com/a11b0edbb3b0237d55ddd42209134150.gif">
    </div>
    <div>
    <img src="https://i.gyazo.com/2d0a80a44d2f3d4d18a93e0b8226412c.gif">
    </div>
  </div>
</div>

infinite scroll/ pagination
liking/viewing likes
comments

fix "in a few seconds" dayjs
time mismatch <1m - just say now
new post needs to invalidate posts by user

Tests:

![All tests](https://i.gyazo.com/6865b9c0015c98633c8313a5d330b7d3.png)

![User](https://i.gyazo.com/5e98b451ae7a385f4c0566e60d265da3.png)

![Post](https://i.gyazo.com/ec98fe081a19114cb2a28ad01326e829.png)

![Comment](https://i.gyazo.com/9c64047fd03e428ec77b803402f45f97.png)

![Like](https://i.gyazo.com/3ea2bbfd174e265e6d924625437949a8.png)
