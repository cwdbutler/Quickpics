/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    API_URL: process.env.API_URL,
  },
  reactStrictMode: true,

  images: {
    domains:
      process.env.NODE_ENV === "production"
        ? ["quickpics-images.s3.eu-west-2.amazonaws.com"]
        : [
            "quickpics-images-test.s3.eu-west-2.amazonaws.com",
            // for seed data
            "randomuser.me",
            "picsum.photos",
          ],
  },
};
