/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'bowlingbling-bucket.s3.ap-northeast-2.amazonaws.com',
      'lh3.googleusercontent.com',
    ],
  },
}

module.exports = nextConfig
