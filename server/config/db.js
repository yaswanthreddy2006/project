const mongoose = require('mongoose');
const path = require('path');
const dns = require('dns');

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

// Load environment variables using dotenv from project root .env file
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  let mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('MongoDB Connection Error: MONGODB_URI environment variable is missing in .env');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000
    });

    console.log('MongoDB Connected');
    console.log(`Connected Host: ${conn.connection.host}`);
    return;
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
  }

  // Fallback direct seed format for Atlas if SRV DNS lookup is restricted by local Windows DNS
  if (mongoURI.includes('cluster0.gbzk3lm.mongodb.net')) {
    try {
      const directAtlasURI = 'mongodb://yaswanthputluru_db_user:7pvR4Yi0SiYP6aBr@cluster0-shard-00-00.gbzk3lm.mongodb.net:27017,cluster0-shard-00-01.gbzk3lm.mongodb.net:27017,cluster0-shard-00-02.gbzk3lm.mongodb.net:27017/klu_student_db?ssl=true&replicaSet=atlas-139zpx-shard-0&authSource=admin&retryWrites=true&w=majority';
      console.log('Attempting direct Atlas node connection...');
      const conn = await mongoose.connect(directAtlasURI, { serverSelectionTimeoutMS: 5000 });
      console.log('MongoDB Connected');
      console.log(`Connected Host: ${conn.connection.host}`);
      return;
    } catch (directErr) {
      console.error('MongoDB Connection Error:', directErr.message);
    }
  }

  // In-memory fallback
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log('MongoDB Connected');
  } catch (memErr) {
    console.error('MongoDB Connection Error:', memErr.message);
  }
};

module.exports = connectDB;
