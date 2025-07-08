const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const newsletterRoutes = require('./routes/newsletter');
const linksRoutes = require('./routes/links');
const settingsRoutes = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/links', linksRoutes);
app.use('/api/settings', settingsRoutes);

// Route handlers for frontend pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'login.html'));
});

app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'dashboard.html'));
});

app.get('/post/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'post.html'));
});

// Handle 404s
app.use((req, res) => {
  res.status(404).send(`
    <html>
      <head>
        <title>404 - Page Not Found</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            text-align: center; 
            padding: 50px; 
            color: #374151; 
          }
          h1 { font-size: 3rem; font-weight: 300; margin-bottom: 1rem; }
          a { color: #6b7280; text-decoration: none; }
          a:hover { color: #1f2937; }
        </style>
      </head>
      <body>
        <h1>404</h1>
        <p>Page not found</p>
        <a href="/">← Back to Articles</a>
      </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Blog: http://localhost:${PORT}`);
  console.log(`Admin: http://localhost:${PORT}/admin`);
  console.log(`\nTo set up the database, run: npm run setup-db`);
  console.log(`Default admin credentials: username=admin, password=admin`);
}); 