const AWS = require('aws-sdk');

exports.handler = async (event) => {
    const { fileId } = event.queryStringParameters;

    // Set up AWS SDK
    const s3 = new AWS.S3();

    // Retrieve the bucket name from environment variable
    const bucketName = process.env.BUCKET_NAME;

    try {
        // Generate a presigned URL for the specified file ID
        const params = {
            Bucket: 'umair - task',
            Key: fileId,
            Expires: 3600, // URL expiration time in seconds
        };
        const presignedUrl = await s3.getSignedUrlPromise('getObject', params);

        return {
            statusCode: 200,
            body: JSON.stringify({ presignedUrl }),
        };
    } catch (error) {
        console.error('Error generating presigned URL:', error);

        return {
            statusCode: 500,
            body: 'Failed to generate presigned URL.',
        };
    }
};
