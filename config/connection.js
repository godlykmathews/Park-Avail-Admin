const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const url = process.env.MONGODB_URL; // Set this in your .env file


const state = {
    db: null
};

module.exports.connect = async function(done) {
    try {
        const url = 'mongodb+srv://workgkm:thisisgkm@clusterparkingapp.htl7b.mongodb.net/?retryWrites=true&w=majority&appName=ClusterParkingApp';
        const dbname = 'ParkingApp';

        const client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,  // Connection pool size
            serverSelectionTimeoutMS: 5000, // Timeout for server selection
            socketTimeoutMS: 45000, // Socket timeout
        });

        state.db = client.db(dbname);
        console.log('Database connected successfully to:', dbname);
        done();
    } catch (error) {
        console.error('Database connection failed:', error);
        done(error);
    }
};

module.exports.get = function() {
    if (!state.db) {
        console.error('Database not initialized. Call connect() first.');
        return null;
    }
    return state.db;
};

// Optional: Add a close function for clean shutdown
module.exports.close = async function() {
    if (state.db) {
        try {
            await state.db.client.close();
            state.db = null;
            console.log('Database connection closed.');
        } catch (error) {
            console.error('Error closing database connection:', error);
        }
    }
};