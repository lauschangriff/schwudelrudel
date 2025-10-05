const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME || 'schwudelrudel';

async function initializeDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(dbName);

    // Read the vacation_properties.json file
    const propertiesPath = path.join(__dirname, '..', 'vacation_properties.json');
    const propertiesData = JSON.parse(fs.readFileSync(propertiesPath, 'utf8'));

    // Clear existing data
    await db.collection('properties').deleteMany({});
    console.log('🗑️  Cleared existing properties');

    // Insert properties
    const result = await db.collection('properties').insertMany(propertiesData);
    console.log(`✅ Inserted ${result.insertedCount} properties`);

    // Create indexes for better performance
    await db.collection('properties').createIndex({ name: 1 });
    await db.collection('properties').createIndex({ 'location.country': 1 });
    await db.collection('properties').createIndex({ state: 1 });
    console.log('✅ Created indexes');

    // Create votes collection with indexes
    await db.collection('votes').createIndex({ propertyId: 1 });
    await db.collection('votes').createIndex({ userId: 1 });
    await db.collection('votes').createIndex({ timestamp: -1 });
    console.log('✅ Created votes collection indexes');

    console.log('\n🎉 Database initialized successfully!');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    await client.close();
  }
}

initializeDatabase();
