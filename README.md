# LIMEBYTE Blog

A simple blog app with admin backend built with Node.js and PostgreSQL.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm

## Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd limebyte
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the project root:
   ```bash
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=limebyte_blog
   DB_PASSWORD=your_db_password
   DB_PORT=5432
   JWT_SECRET=your-super-secret-jwt-key
   PORT=3000
   NODE_ENV=production
   ```

3. **Set up PostgreSQL:**
   ```bash
   # Create database and user
   sudo -u postgres psql
   CREATE DATABASE limebyte_blog;
   ALTER USER postgres PASSWORD 'your_db_password';
   \q
   ```

4. **Deploy database:**
   ```bash
   npm run deploy
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

## Usage

- **Blog:** `http://localhost:3000`
- **Admin:** `http://localhost:3000/admin`
- **Default login:** username=`admin`, password=`admin`

## Scripts

- `npm start` - Start the server
- `npm run deploy` - Fresh database deployment
- `npm run dev` - Development mode with nodemon

That's it! 🚀 