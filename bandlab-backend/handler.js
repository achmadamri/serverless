module.exports.createPost = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Post created successfully!",
    }),
  };
};

module.exports.addComment = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Comment added successfully!",
    }),
  };
};
