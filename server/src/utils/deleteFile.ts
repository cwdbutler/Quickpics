import { S3 } from "aws-sdk";

export function deleteFile(id: string) {
  const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_BUCKET_REGION,
  });

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${id}.jpg`,
  };

  return s3.deleteObject(params).promise();
}
