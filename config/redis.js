const redis = require('redis');

const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379,
    legacyMode: false
});

// Connect to Redis
(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis successfully');
    } catch (err) {
        console.error('Redis connection error:', err);
    }
})();

// Error handling
redisClient.on('error', (err) => {
    console.log('Redis Client Error:', err);
});

module.exports = redisClient; 