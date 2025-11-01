import Post from '../model/post.js';

export const createPost = async (req, res) => {
    try {
        const post = new Post(req.body); // remove await here
        await post.save();               // await the save instead
        return res.status(200).json({ message: "Post created successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error creating post", error: error.message });
    }
};

export const getAllPosts = async (req, res) => {
    let category = req.query.category;
    let posts;
    try {
        if (category){
            posts = await Post.find({categories: category});
        } else{
            posts = await Post.find({});
        }
        return res.status(200).json(posts); 
    } catch (error) {
        return res.status(500).json({ message: "Error fetching posts", error: error.message });
    }
};

export const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json(post);
    } catch(error){
        return res.status(500).json({ message: "Error fetching post", error: error.message });
    
    }
};

export const updatePost = async (req, res) => { 
    try {
        const post = await Post.findById(req.params.id)
        if (!post){
            return res.status(404).json({ message: "Post not found" });
        }
        await Post.findByIdAndUpdate(req.params.id, {$set: req.body});
        return res.status(200).json({ message: "Post updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error updating post", error: error.message });
    }
        
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ 
      message: "Error deleting post", 
      error: error.message 
    });
  }
};
