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

### 2. Install Dependencies

Run the following command to install the required packages:

```bash
npm install

### 3. Set up Environment Variables

Create a .env file in the root directory with the following variables:

```bash
DYNAMODB_TABLE_POSTS=your-dynamodb-posts-table
DYNAMODB_TABLE_COMMENTS=your-dynamodb-comments-table
S3_BUCKET=your-s3-bucket-name
SNS_TOPIC_ARN=your-sns-topic-arn
SQS_QUEUE_URL=your-sqs-queue-url