const AWS = require('aws-sdk');
const sns = new AWS.SNS();

module.exports.createPost = async (event) => {
  const body = JSON.parse(event.body);
  const caption = body.caption || "Default caption";

  // Simulate saving the post (e.g., save to a DB)
  const postId = Math.floor(Math.random() * 10000).toString(); // Random postId for demonstration

  // Publish the PostCreated event to SNS
  const message = {
    postId: postId,
    caption: caption,
  };

  const params = {
    Message: JSON.stringify(message),
    TopicArn: process.env.SNS_TOPIC_ARN, // Accessing SNS_TOPIC_ARN from environment variables
  };

  await sns.publish(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Post created successfully!",
      postId: postId,
      caption: caption,
    }),
  };
};

module.exports.addComment = async (event) => {
  const body = JSON.parse(event.body);
  const { postId } = event.pathParameters;
  const commentContent = body.content || "Default comment";

  // Simulate saving the comment
  const commentId = Math.floor(Math.random() * 10000).toString(); // Random commentId for demonstration

  // Publish the CommentAdded event to SNS
  const message = {
    postId: postId,
    commentId: commentId,
    content: commentContent,
  };

  const params = {
    Message: JSON.stringify(message),
    TopicArn: process.env.SNS_TOPIC_ARN, // Accessing SNS_TOPIC_ARN from environment variables
  };

  await sns.publish(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Comment added successfully!",
      postId: postId,
      commentId: commentId,
      content: commentContent,
    }),
  };
};
