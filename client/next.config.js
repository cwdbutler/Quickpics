/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      "quickpics-images.s3.eu-west-2.amazonaws.com",
      "randomuser.me", // seed data
      "picsum.photos", // remove these in prod
    ],
  },
};
