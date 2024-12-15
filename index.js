const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); // Untuk melayani file statis
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

// Untuk mem-parsing URL yang dikirim dari form (application/x-www-form-urlencoded)
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware untuk melayani file statis (termasuk HTML, CSS, dan JS)
app.use(express.static(path.join(__dirname, 'public')));

const isValidUrl = (inputUrl) => {
  try {
      const parsedUrl = new URL(inputUrl);
      console.log("URL" , inputUrl)
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (err) {
      return false;
  }
};

var totalUrl = 1;
var urlDatabase = {};


// Route untuk halaman utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// API untuk URL shortener
app.post('/api/shorturl', (req, res) => {
  const url = req.body.url; // Ambil URL dari body request
  if (!isValidUrl(url)) {
    return res.json({ error: 'invalid url' });
  }

  // Membuat short URL
  const shortUrl = totalUrl++;
  urlDatabase[shortUrl] = url;

  res.json({
    original_url: url,
    short_url: shortUrl,
  });
});

// Endpoint untuk redirect ke URL asli
app.get('/api/shorturl/:id', (req, res) => {
  const shortUrl = req.params.id;
  const url = urlDatabase[shortUrl];

  if (!url) {
    return res.json({ error: 'invalid url' });
  }

  res.redirect(url);
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
