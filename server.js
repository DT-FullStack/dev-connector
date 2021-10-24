const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const path = require('path');

const connectDB = require('./config/db');
connectDB();

app.use(express.json({ extended: false }));

/** In development you want this line, but in production get rid of it! */
// app.get('/', (req, res) => { res.send('API Running') })

app.use('/api/users', require('./routes/api/users'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))

/**
 * Serve static assets in production
 */
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send(err.message);
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})

