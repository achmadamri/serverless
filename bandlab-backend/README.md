# BandLab Test Assignment (Backend)

This is the backend implementation for the BandLab test assignment. The goal is to build an image-sharing system that allows users to upload images, add captions, comment on posts, and list posts with the last two comments. The system is designed to be RESTful, scalable, and efficient, leveraging AWS services.

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Prerequisites](#prerequisites)
4. [Getting Started](#getting-started)
   - [Clone the Repository](#1-clone-the-repository)
   - [Install Dependencies](#2-install-dependencies)
   - [Set up Environment Variables](#3-set-up-environment-variables)
   - [Deploy the Application](#4-deploy-the-application)
   - [Running Locally](#5-running-locally)
   - [Testing the Endpoints](#6-testing-the-endpoints)
5. [Endpoints](#endpoints)
6. [Project Structure](#project-structure)
7. [Notes](#notes)
8. [Future Improvements](#future-improvements)
9. [License](#license)

## Features

- Upload images with captions.
- Convert images to `.jpg` format and resize them to 600x600 pixels.
- Comment on posts and delete comments.
- Retrieve posts along with the last two comments.
- Cursor-based pagination for listing posts.
- Posts are sorted by the number of comments in descending order.
- Scalable and serverless architecture using AWS.

## Technologies Used

- **Node.js** for backend logic.
- **AWS Lambda** for serverless functions.
- **AWS S3** for storing images.
- **AWS DynamoDB** for storing posts and comments.
- **AWS SNS** for sending notifications about new posts.
- **AWS SQS** for queuing comments for additional processing.
- **Sharp** for image processing (resizing and converting formats).
- **Serverless Framework** for managing AWS Lambda and other resources.

## Prerequisites

Make sure you have the following installed on your local machine:

- Node.js (v14 or higher)
- npm (v6 or higher)
- AWS CLI configured with appropriate permissions
- Serverless Framework installed globally (`npm install -g serverless`)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install Dependencies

Run the following command to install the required packages:

```bash
npm install
```

### 3. Set up Environment Variables

Create a .env file in the root directory with the following variables:

```bash
DYNAMODB_TABLE_POSTS=your-dynamodb-posts-table
DYNAMODB_TABLE_COMMENTS=your-dynamodb-comments-table
S3_BUCKET=your-s3-bucket-name
SNS_TOPIC_ARN=your-sns-topic-arn
SQS_QUEUE_URL=your-sqs-queue-url
```

Make sure to replace the placeholders with the actual AWS resource values from your AWS account.

### 4. Deploy the Application
To deploy the application to AWS, use the following command:

```bash
serverless deploy
```

This command will deploy your Lambda functions and provision the necessary AWS resources, including DynamoDB tables, S3 bucket, SNS, and SQS.

### 5. Running Locally

To run the project locally using the Serverless Framework, you can use the following command:

```bash
serverless offline
```

This will start a local instance of the API, allowing you to test the functions before deploying them to AWS.

### 6. Testing the Endpoints

You can test the API endpoints using tools like Postman or curl. Below are the endpoints with example requests.

## Endpoints

1. Create a Post with Image Upload
Method: POST /posts
Body:
```bash
{
  "caption": "My first post",
  "image": "<base64_encoded_image_data>"
}
```
Description: Upload an image (base64-encoded) and set a caption. The image will be resized and converted to .jpg, then saved to S3.

2. Add a Comment to a Post
Method: POST /posts/{postId}/comments
Body:
```bash
{
  "content": "Nice picture!"
}
```
Description: Add a comment to a specific post by its postId.

3. Delete a Comment
Method: DELETE /posts/{postId}/comments/{commentId}
Description: Delete a comment by its commentId for the specified postId.

4. List Posts with the Last Two Comments
Method: GET /posts?limit=10&cursor=<optional_cursor>
Description: Retrieve posts, sorted by the number of comments in descending order. Each post will include the last two comments. Supports cursor-based pagination.

## Project Structure

```bash
.
├── handler.js            # Lambda functions (create post, add comment, delete comment, list posts)
├── serverless.yml        # Serverless configuration for AWS resources and deployment
├── package.json          # Project metadata and dependencies
├── .env                  # Environment variables (excluded from repository)
└── README.md             # Project documentation
```

Key Files:
handler.js: Contains the core logic for creating posts, adding comments, deleting comments, and listing posts.
serverless.yml: Manages AWS infrastructure provisioning and Lambda function deployments using the Serverless Framework.

Notes
The system accepts images in .jpg, .png, and .bmp formats with a maximum size of 100MB.
Images are automatically resized to 600x600 pixels and converted to .jpg format.
Pre-signed URLs are used for securely retrieving images from S3.
The system leverages AWS services for scalability and serverless computing, ensuring it can handle high traffic efficiently.

Future Improvements
Error Handling: Implement more robust error handling for edge cases, including invalid image formats or sizes.
Performance Monitoring: Add performance monitoring tools to track API response times and throughput, ensuring non-functional requirements are met.
Authentication: Introduce user authentication and authorization to secure the API and associate posts and comments with authenticated users.
Logging: Improve logging and tracing for debugging and monitoring the system in production.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

This full `README.md` provides comprehensive details for cloning, setting up, deploying, and running your project. It also covers all the endpoints and project structure, ensuring the reader has a complete understanding of the project.