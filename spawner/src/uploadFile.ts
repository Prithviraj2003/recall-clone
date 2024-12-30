const fs = require("fs");
const AWS = require("aws-sdk");
require("dotenv").config();
// Configure AWS S3
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Replace with your access key
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Replace with your secret key
  region: process.env.AWS_REGION, // Replace with your region
});
console.log(process.env.AWS_ACCESS_KEY_ID);
const s3 = new AWS.S3();

/**
 * Uploads a video file to an S3 bucket.
 * @param {string} filePath - The local path to the video file.
 * @param {string} key - The key (file name) to save the video as in the bucket.
 */
export const uploadVideoToS3 = async (
  filePath: string,
  key: string
): Promise<string> => {
  try {
    // Read the file from local storage
    const fileContent = fs.readFileSync(filePath);

    // Upload parameters
    const params = {
      Bucket: "recall-clone-recordings",
      Key: key,
      Body: fileContent,
      ContentType: "video/mp4", // Adjust the MIME type as needed
    };

    // Upload file to S3
    const data = await s3.upload(params).promise();
    const url = await generatePresignedUrl("recall-clone-recordings", key);
    return url;
  } catch (error) {
    console.error("Error uploading file:", error);
    return "Upload failed";
  }
};

export const generatePresignedUrl = async (bucketName:string, key:string, expiry = 3600):Promise<string> => {
  try {
    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: expiry, // Time in seconds (default: 1 hour)
    };
    const url = await s3.getSignedUrlPromise("getObject", params);
    return url;
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    throw error;
  }
};


