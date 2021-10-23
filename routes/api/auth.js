const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')

const { check, validationResult } = require('express-validator')
const config = require('config');

const User = require('../../models/User');
const asyncWrap = require('../../errors/asyncRouteHandler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @route       GET api/auth
 * @description Test route
 * @access      Public
 */
router.get('/', auth, asyncWrap(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
}))

/**
 * @route       POST api/auth
 * @description Authenticate use & get token
 * @access      Public
 */
router.post('/', [
  check('email', 'Email required').isEmail(),
  check('password', 'Password required').exists()
], asyncWrap(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array() }) }

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });

  const pwMatch = await bcrypt.compare(password, user.password);
  if (!pwMatch) return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });

  const payload = { user: { id: user.id } }
  jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
    if (err) throw err;
    res.json({ token });
  })
}))


module.exports = router;