const Post = require("../models/Post");
const { StatusCodes } = require("http-status-codes");

async function addCategories(req, res, categories) {
  const postCategories = req.body.categories;

  for (let i = 0; i < postCategories.length; i++) {
    const category = postCategories[i];
    if (!categories.includes(category)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          `There is no ${category} category, categories available: ${categories}`
        );
      return false;
    }
  }

  req.body.user = req.user.userId;
  req.body.username = req.user.name;
  const post = await Post.create(req.body);

  res.status(StatusCodes.CREATED).json(post);
  return true;
}

module.exports = addCategories;
