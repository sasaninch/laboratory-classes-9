const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");

dotenv.config();

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

app.use(cors()); 
app.use(express.json());

app.use("/api/books", bookRoutes);
app.use("/api/authors", authorRoutes);

app.get("/", (req, res) => {
  res.json({ 
    message: "REST API for Books and Authors",
    endpoints: {
      books: {
        "GET /api/books": "Get all books",
        "POST /api/books": "Create new book",
        "DELETE /api/books/:id": "Delete book"
      },
      authors: {
        "GET /api/authors": "Get all authors",
        "POST /api/authors": "Create new author",
        "PUT /api/authors/:id": "Update author"
      }
    }
  });
});

const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    
    await mongoose.connect(MONGO_URI);
    console.log('📦 Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('📦 MongoDB connection closed');
  process.exit(0);
});

const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📋 API documentation available at http://localhost:${PORT}`);
  });
};

startServer();