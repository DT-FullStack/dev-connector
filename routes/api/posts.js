const express = require('express');
const router = express.Router();
const { check } = require('express-validator')


const errorCheck = require('../../middleware/formValidationError');
const auth = require('../../middleware/auth');
const asyncWrap = require('../../errors/asyncRouteHandler');

const User = require('../../models/User')
const Profile = require('../../models/Profile')
const Post = require('../../models/Post')

/**
 * @route       GET api/posts
 * @description Test route
 * @access      Private
 */
router.get('/', auth, asyncWrap(async (req, res) => {
  const posts = await Post.find().sort({ date: -1 })
  res.json(posts);
}))

/**
 * @route       GET api/posts/:id
 * @description Test route
 * @access      Private
 */
router.get('/:id', auth, asyncWrap(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ errors: [{ msg: 'Post not found' }] })
  res.json(post);
}))

/**
 * @route       DELETE api/posts/:id
 * @description Test route
 * @access      Private
 */
router.delete('/:id', auth, asyncWrap(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ errors: [{ msg: 'Post not found' }] })
  console.log(post.user.toString(), req.user.id);
  if (post.user.toString() !== req.user.id) return res.status(401).json({ errors: [{ msg: 'Not authorized' }] })
  await post.remove();
  res.json({ success: [{ msg: 'Post deleted' }] });
}))

/**
 * @route       PUT api/posts/like/:id
 * @description Test route
 * @access      Private
 */
router.put('/like/:id', auth, asyncWrap(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ errors: [{ msg: 'Post not found' }] })
  if (post.likes.filter(like => like.user.toString() === req.user.id).length) return res.status(400).json({ errors: [{ msg: 'Already liked' }] });
  post.likes.unshift({ user: req.user.id });
  await post.save();

  res.json(post.likes);
}))

/**
 * @route       DELETE api/posts/like/:id
 * @description Test route
 * @access      Private
 */
router.delete('/like/:id', auth, asyncWrap(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ errors: [{ msg: 'Post not found' }] });
  const foundLike = post.likes.find(like => like.user.toString() === req.user.id);
  if (!foundLike) return res.status(404).json({ errors: [{ msg: 'Not liked' }] });
  post.likes.splice(post.likes.indexOf(foundLike), 1);
  await post.save();

  res.json(post.likes);
}))

/**
 * @route       POST api/posts
 * @description Test route
 * @access      Private
 */
router.post('/', [auth, [
  check('text', 'Text is required').not().isEmpty()
], errorCheck], asyncWrap(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) res.status(400).json({ errors: [{ msg: 'User not found' }] })
  const attrs = {
    text: req.body.text,
    name: user.name,
    avatar: user.avatar,
    user: req.user.id
  }
  console.log(req.user.id);
  const post = await new Post(attrs);
  await post.save();
  res.json(post);
}))

/**
 * @route       POST api/posts/comment/:post
 * @description Test route
 * @access      Private
 */
router.post('/comment/:post', [auth, [
  check('text', 'Text is required').not().isEmpty()
], errorCheck], asyncWrap(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) res.status(400).json({ errors: [{ msg: 'User not found' }] })
  const post = await Post.findById(req.params.post);
  if (!post) res.status(404).json({ errors: [{ msg: 'Post not found' }] })
  const attrs = {
    text: req.body.text,
    name: user.name,
    avatar: user.avatar,
    user: req.user.id
  }
  post.comments.unshift(attrs);
  await post.save();
  res.json(post.comments);
}))

/**
 * @route       DELETE api/posts/comment/:post_id/:comment_id
 * @description Test route
 * @access      Private
 */
router.delete('/comment/:post_id/:comment_id', auth, asyncWrap(async (req, res) => {
  const { post_id, comment_id } = req.params;
  const post = await Post.findById(post_id);
  if (!post) return res.status(404).json({ errors: [{ msg: 'Post not found' }] });
  const foundComment = post.comments.find(comment => comment.user.toString() === req.user.id);
  if (!foundComment) return res.status(404).json({ errors: [{ msg: 'Comment not found' }] });
  if (foundComment.user.toString() !== req.user.id) return res.status(401).json({ errors: [{ msg: 'Not authorized' }] })
  post.comments.splice(post.comments.indexOf(foundComment), 1);
  await post.save();

  res.json(post.comments);
}))

module.exports = router;