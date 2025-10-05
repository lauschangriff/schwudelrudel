const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = process.env.DATABASE_NAME || 'schwudelrudel';

let db;

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    db = client.db(dbName);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// API Routes

// Get all properties
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await db.collection('properties').find().toArray();
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get single property by ID
app.get('/api/properties/:id', async (req, res) => {
  try {
    const property = await db.collection('properties').findOne({
      _id: new ObjectId(req.params.id)
    });
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Create new property
app.post('/api/properties', async (req, res) => {
  try {
    const result = await db.collection('properties').insertOne(req.body);
    res.status(201).json({
      message: 'Property created',
      id: result.insertedId
    });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Update property
app.put('/api/properties/:id', async (req, res) => {
  try {
    const { _id, ...updateData } = req.body; // Remove _id from update data
    const result = await db.collection('properties').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({ message: 'Property updated successfully' });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// Delete property
app.delete('/api/properties/:id', async (req, res) => {
  try {
    const result = await db.collection('properties').deleteOne({
      _id: new ObjectId(req.params.id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// Vote for a property (upsert - user can only vote once, but can change their vote)
app.post('/api/vote', async (req, res) => {
  try {
    const { propertyId, userId, userName, vote } = req.body;

    // Check if user already voted for this property
    const existingVote = await db.collection('votes').findOne({
      propertyId,
      userId
    });

    if (existingVote) {
      // Update existing vote
      await db.collection('votes').updateOne(
        { propertyId, userId },
        {
          $set: {
            vote,
            userName,
            timestamp: new Date()
          }
        }
      );
      res.json({ message: 'Vote updated' });
    } else {
      // Create new vote
      const voteData = {
        propertyId,
        userId,
        userName,
        vote, // 'pro' or 'contra'
        timestamp: new Date()
      };
      await db.collection('votes').insertOne(voteData);
      res.status(201).json({ message: 'Vote recorded' });
    }
  } catch (error) {
    console.error('Error recording vote:', error);
    res.status(500).json({ error: 'Failed to record vote' });
  }
});

// Get votes for a property
app.get('/api/votes/:propertyId', async (req, res) => {
  try {
    const votes = await db.collection('votes')
      .find({ propertyId: req.params.propertyId })
      .toArray();
    res.json(votes);
  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
});

// Get all votes
app.get('/api/votes', async (req, res) => {
  try {
    const votes = await db.collection('votes').find().toArray();
    res.json(votes);
  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
});

// Add comment to a property
app.post('/api/comment', async (req, res) => {
  try {
    const { propertyId, userId, userName, text } = req.body;

    const commentData = {
      propertyId,
      userId,
      userName,
      text,
      timestamp: new Date()
    };

    const result = await db.collection('comments').insertOne(commentData);
    res.status(201).json({
      message: 'Comment added',
      id: result.insertedId
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Get comments for a property
app.get('/api/comments/:propertyId', async (req, res) => {
  try {
    const comments = await db.collection('comments')
      .find({ propertyId: req.params.propertyId })
      .toArray();
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Get all comments
app.get('/api/comments', async (req, res) => {
  try {
    const comments = await db.collection('comments').find().toArray();
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Delete comment
app.delete('/api/comment/:id', async (req, res) => {
  try {
    const result = await db.collection('comments').deleteOne({
      _id: new ObjectId(req.params.id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down gracefully...');
  await client.close();
  process.exit(0);
});
