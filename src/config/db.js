const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  console.log("mongo url is : ",uri)
  if (!uri) throw new Error('MONGODB_URI is not set');
  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, { autoIndex: true });
  console.log('✅ MongoDB connected');
}

module.exports = { connectDB };
