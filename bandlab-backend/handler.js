const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const sqs = new AWS.SQS();
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const sharp = require('sharp');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); // Import Swagger config

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const POSTS_TABLE = process.env.DYNAMODB_TABLE_POSTS;
const COMMENTS_TABLE = process.env.DYNAMODB_TABLE_COMMENTS;
const S3_BUCKET = process.env.S3_BUCKET;
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;

// Function to create a new post
/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     description: Creates a new post with an image and caption
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: post
 *         description: The post to create
 *         schema:
 *           type: object
 *           required:
 *             - caption
 *             - image
 *           properties:
 *             caption:
 *               type: string
 *             image:
 *               type: string
 *     responses:
 *       200:
 *         description: Post created successfully
 */
module.exports.createPost = async (event) => {
  const body = JSON.parse(event.body);
  const caption = body.caption || "Default caption";
  const image = body.image; // Base64 encoded image data

  // Validate image size and type (png, jpg, bmp)
  // Decode and resize image using sharp
  const resizedImage = await sharp(Buffer.from(image, 'base64'))
    .resize(600, 600)
    .toFormat('jpg')
    .toBuffer();

  const postId = Math.floor(Math.random() * 10000).toString();
  const imageKey = `${postId}.jpg`;

  // Save resized image to S3
  await s3.putObject({
    Bucket: S3_BUCKET,
    Key: imageKey,
    Body: resizedImage,
    ContentType: 'image/jpeg',
  }).promise();

  // Save post details in DynamoDB
  const post = {
    postId: postId,
    caption: caption,
    image: imageKey,
    creator: "User", // You might want to extract this from event data
    createdAt: new Date().toISOString(),
    comments: 0
  };
  await dynamoDB.put({
    TableName: POSTS_TABLE,
    Item: post,
  }).promise();

  // Publish SNS message
  await sns.publish({
    Message: JSON.stringify({ postId, caption }),
    TopicArn: SNS_TOPIC_ARN
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Post created successfully!",
      post: post
    }),
  };
};

// Function to add a comment
/**
 * @swagger
 * /posts/{postId}/comments:
 *   post:
 *     summary: Add a comment to a post
 *     description: Adds a new comment to a post
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID of the post
 *         schema:
 *           type: string
 *       - in: body
 *         name: comment
 *         description: The comment to add
 *         schema:
 *           type: object
 *           required:
 *             - content
 *           properties:
 *             content:
 *               type: string
 *     responses:
 *       200:
 *         description: Comment added successfully
 */
module.exports.addComment = async (event) => {
  const body = JSON.parse(event.body);
  const { postId } = event.pathParameters;
  const commentContent = body.content || "Default comment";

  const commentId = Math.floor(Math.random() * 10000).toString();
  const comment = {
    commentId: commentId,
    postId: postId,
    content: commentContent,
    creator: "User", // Add user information here
    createdAt: new Date().toISOString(),
  };

  // Save comment in DynamoDB
  await dynamoDB.put({
    TableName: COMMENTS_TABLE,
    Item: comment,
  }).promise();

  // Increment comment count in post
  await dynamoDB.update({
    TableName: POSTS_TABLE,
    Key: { postId },
    UpdateExpression: "SET comments = comments + :inc",
    ExpressionAttributeValues: { ":inc": 1 },
  }).promise();

  // Send SQS message
  await sqs.sendMessage({
    QueueUrl: SQS_QUEUE_URL,
    MessageBody: JSON.stringify({ commentId, postId, content: commentContent }),
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Comment added successfully!",
      comment: comment,
    }),
  };
};

// Function to delete a comment
/**
 * @swagger
 * /posts/{postId}/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment from a post
 *     description: Deletes a specific comment from a post
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID of the post
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: ID of the comment
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 */
module.exports.deleteComment = async (event) => {
  const { postId, commentId } = event.pathParameters;

  // Delete the comment
  await dynamoDB.delete({
    TableName: COMMENTS_TABLE,
    Key: { postId, commentId }
  }).promise();

  // Decrement comment count in post
  await dynamoDB.update({
    TableName: POSTS_TABLE,
    Key: { postId },
    UpdateExpression: "SET comments = comments - :dec",
    ExpressionAttributeValues: { ":dec": 1 },
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Comment deleted successfully!",
      commentId: commentId,
    }),
  };
};

// Function to list posts with last two comments
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get a list of posts
 *     description: Retrieves all posts along with the last two comments for each
 *     responses:
 *       200:
 *         description: List of posts
 */
module.exports.listPosts = async (event) => {
  const params = {
    TableName: POSTS_TABLE,
    Limit: 10, // Implement pagination using this limit and a cursor
    ScanIndexForward: false, // Sort by comments in descending order
  };

  const result = await dynamoDB.scan(params).promise();
  const posts = result.Items;

  // Retrieve last two comments for each post
  for (const post of posts) {
    const commentParams = {
      TableName: COMMENTS_TABLE,
      KeyConditionExpression: "postId = :postId",
      ExpressionAttributeValues: { ":postId": post.postId },
      Limit: 2, // Get last 2 comments
      ScanIndexForward: false,
    };
    const commentResult = await dynamoDB.query(commentParams).promise();
    post.comments = commentResult.Items;
  }

  return {
    statusCode: 200,
    body: JSON.stringify(posts),
  };
};

module.exports.app = app;
