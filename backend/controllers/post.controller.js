const Post = require("../models/post");

const create = async (req, res) => {
  try {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId,
    });
    const newPost = await post.save();
    res.status(201).json({
      message: "Post added successfully",
      post: {
        ...newPost,
        id: newPost._id,
      },
    });
  } catch (error) {
    return res.status(400).json({
      error: "Somthng went wrong..",
    });
  }
};

const list = (req, res) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count,
      });
    });
};

const remove = async (req, res) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
    result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    }
  );
};

const read = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log(pos);
    res.status(200).json(post);
  } catch (error) {
    return res.status(400).json({
      error: "Smthn went wrong..",
    });
  }
};

const edit = async (req, res) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const isExist = await Post.findById(req.param.id);
  if (!isExist) return res.status(404).json({ error: "Post not found!" });
  if (isExist.creator !== req.userData.userId)
    return res.status(403).json({ error: "403 Authorization Error!" });

  try {

    isExist.title = req.body.title
    isExist.content = req.body.content
    isExist.imagePath = imagePath

    isExist.save();

    res.status(200).json({ message: "Update successful!" });
  } catch (error) {
    return res.status(400).json({
      error: "Smthn went wrong..",
    });
  }
};

module.exports = {
  create,
  list,
  read,
  edit,
  remove,
};
