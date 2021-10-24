const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator')
const config = require('config');

const User = require('../../models/User');
const asyncWrap = require('../../errors/asyncRouteHandler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const gravatar = require('gravatar');

/**
 * @route       POST api/users
 * @description Register user
 * @access      Public
 */
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Must be six or more characters').isLength({ min: 6 })
], asyncWrap(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array() }) }

  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) return res.status(400).json({ errors: [{ msg: 'User already exists' }] });

  const avatar = `https:${gravatar.url(email, { s: '200', r: 'pg', d: 'mm' })}`;

  const hash = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, avatar, password: hash });
  await newUser.save();

  const payload = { user: { id: newUser.id } }
  jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
    if (err) throw err;
    res.json({ token });
  })
}))



module.exports = router;