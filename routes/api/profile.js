const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const asyncWrap = require('../../errors/asyncRouteHandler')

const { check } = require('express-validator')
const errorCheck = require('../../middleware/formValidationError');
const config = require('config');

const jwt = require('jsonwebtoken');
const request = require('request');

const Profile = require('../../models/Profile')
const User = require('../../models/User')

/**
 * @route       GET api/profile/me
 * @description Test route
 * @access      Private
 */
router.get('/me', auth, asyncWrap(async (req, res) => {
  const profile = await Profile.findById(req.user.id).populate('user', ['name', 'avatar']);
  if (!profile) return res.status(400).json({ errors: [{ msg: 'There is no profile for this user' }] });
  res.json(profile);
}))

/**
 * @route       POST api/profile
 * @description Create or update profile
 * @access      Private
 */
router.post('/', [auth, [
  check('status', 'Status is required').not().isEmpty(),
  check('skills', 'Skills is required').not().isEmpty(),
], errorCheck], asyncWrap(async (req, res) => {
  const attrs = { company, website, location, bio, status, githubusername, skills, social } = req.body;
  attrs.user = req.user.id;

  /**
   * @description findOneAndUpdate takes three params
   * @param {object} findQuery
   * @param {object} attrFields
   * @param {object} queryOptions
   * * `upsert` will insert a new document if it doesn't exist
   * * `returnDocument` determines whether to return the old document or the updated document
   */
  const profile = await Profile.findOneAndUpdate({ user: attrs.user }, attrs,
    {
      upsert: true,
      returnDocument: 'after'
    }).populate('user', ['name', 'avatar'])
  res.json(profile);
}))

/**
 * @route       GET api/profile
 * @description Get all profiles
 * @access      Public
 */
router.get('/', asyncWrap(async (req, res) => {
  const profiles = await Profile.find({}).populate('user', ['name', 'avatar']);
  res.json(profiles);
}))

/**
 * @route       DELETE api/profile
 * @description Delete profile, user, and posts
 * @access      Private
 */
router.delete('/', auth, asyncWrap(async (req, res) => {
  await Profile.findOneAndRemove({ user: req.user.id });
  await User.findByIdAndRemove(req.user.id);
  res.json({ success: [{ msg: 'User deleted' }] });
}))

/**
 * @route       GET api/profile/user/:user
 * @description Get profile by user id
 * @access      Public
 */
router.get('/user/:user', asyncWrap(async (req, res) => {
  const { user } = req.params;
  const profile = await Profile.findOne({ user }).populate('user', ['name', 'avatar']);
  if (!profile) return res.status(400).json({ errors: [{ msg: "No profile for this user" }] });
  res.json(profile);
}))

/**
 * @route       PUT api/profile/experience
 * @description Add experience
 * @access      Private
 */
router.put('/experience', [auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty(),
], errorCheck], asyncWrap(async (req, res) => {
  const attrs = { title, company, location, from, to, current, description } = req.body;
  const profile = await Profile.findOne({ user: req.user.id });
  if (!profile) return res.status(400).json({ errors: [{ msg: 'Profile not found' }] })
  profile.experience.unshift(attrs);
  await profile.save();
  res.json(profile);
}))
/**
 * @route       DELETE api/profile/experience
 * @description Remove experience
 * @access      Private
 */
router.delete('/experience/:id', auth, asyncWrap(async (req, res) => {
  const { id } = req.params;
  const profile = await Profile.findOne({ user: req.user.id });
  if (!profile) return res.status(400).json({ errors: [{ msg: 'Profile not found' }] })
  const index = profile.experience.map(i => i.id).indexOf(id);
  if (index < 0) return res.status(400).json({ errors: [{ msg: 'Experience not found' }] })
  profile.experience.splice(index, 1);
  await profile.save();
  res.json(profile);
}))

/**
 * @route       PUT api/profile/education
 * @description Add education
 * @access      Private
 */
router.put('/education', [auth, [
  check('school', 'School is required').not().isEmpty(),
  check('degree', 'Degree is required').not().isEmpty(),
  check('fieldofstudy', 'Field of Study is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty(),
], errorCheck], asyncWrap(async (req, res) => {
  const attrs = { school, degree, from, to, fieldofstudy, current, description } = req.body;
  const profile = await Profile.findOne({ user: req.user.id });
  if (!profile) return res.status(400).json({ errors: [{ msg: 'Profile not found' }] })
  profile.education.unshift(attrs);
  await profile.save();
  res.json(profile);
}))
/**
 * @route       DELETE api/profile/education
 * @description Remove education
 * @access      Private
 */
router.delete('/education/:id', auth, asyncWrap(async (req, res) => {
  const { id } = req.params;
  const profile = await Profile.findOne({ user: req.user.id });
  if (!profile) return res.status(400).json({ errors: [{ msg: 'Profile not found' }] })
  const index = profile.education.map(i => i.id).indexOf(id);
  if (index < 0) return res.status(400).json({ errors: [{ msg: 'Education not found' }] })
  profile.education.splice(index, 1);
  await profile.save();
  res.json(profile);
}))

/**
 * @route       GET api/profile/github/:username
 * @description Get profile by user id
 * @access      Public
 */
router.get('/github/:username', asyncWrap(async (req, res) => {
  const { username } = req.params;
  const options = {
    uri: `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubClientSecret')}`,
    method: "GET",
    headers: { 'user-agent': 'node-js' }
  }
  request(options, (error, response, body) => {
    if (error) console.error(error);
    if (response.statusCode !== 200) res.status(404).json({ errors: [{ msg: 'No Github profile found' }] });
    res.json(JSON.parse(body));
  })
  // const profile = await Profile.findOne({ user });
  // if (!profile) return res.status(400).json({ errors: [{ msg: "No profile for this user" }] });
  // res.json(profile);
}))


module.exports = router;