const Post = require('../models/post');

exports.createPosts = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename    ,
    creator: req.userData.userId
  });

   post.save().then((createdPost) => {
     console.log(createdPost);
     res.status(201).json({
      message: 'Post added successfully',
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
   }).catch(error => {
     res.status(500).json({
       message: 'Creating a post failed.'
     });
   });
}

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = `${url}/images/${req.file.filename}`;
  }
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId}, post).then(result => {
    if (result.nModified > 0) {
      res.status(200).json({ message: 'Update successful'});
    } else {
      res.status(401).json({ message: 'Not authorized!'});
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Could not update post!'
    });
  });
}

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);

  }
  postQuery.find().then(documents => {
    fetchedPosts = documents;
    return Post.count();
  })
  .then(count => {
    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: fetchedPosts,
      maxPosts: count
    });
  }).catch(error => {
    res.status(500).json({
      message: 'Fetching posts failed'
    });
  });
  // as a note: find does not really return a promise but rather the objects
  // that it returns behaves like a promise
}

exports.deletePost  = (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({
    _id: req.params.id,
    creator: req.userData.userId
  }).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: 'Deletion successful'});
    } else {
      res.status(401).json({ message: 'Not authorized!'});
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Fetching posts failed'
    });
  });
}

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      req.status(404).json({message: 'Post not found'});
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Fetching posts failed'
    });
  });
}

