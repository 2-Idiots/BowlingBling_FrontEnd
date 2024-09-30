/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['bowlingbling-bucket.s3.ap-northeast-2.amazonaws.com'], // S3 버킷 호스트 추가
  },
}

module.exports = nextConfig
