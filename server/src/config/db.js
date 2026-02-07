const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/silver-notes');
        console.log('Connected to Local MongoDB');
    } catch (err) {
        console.log('Could not connect to local MongoDB. Starting In-Memory fallback...');
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            await mongoose.connect(uri);
            console.log(`Connected to In-Memory MongoDB at ${uri}`);
        } catch (fallbackErr) {
            console.error('Fatal: Could not start In-Memory MongoDB:', fallbackErr);
            process.exit(1);
        }
    }
};

module.exports = connectDB;
