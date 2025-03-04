const redisClient = require('../config/redis');

const cacheMiddleware = (duration) => {
    return async (req, res, next) => {
        try {
            const key = 'cache:' + req.originalUrl || req.url;
            
            // Try to get data from cache
            const data = await redisClient.get(key);
            
            if (data !== null) {
                // Cache hit
                console.log('Cache hit for:', key);
                return res.send(JSON.parse(data));
            }

            // Cache miss - store the original send function
            const originalSend = res.send;
            res.send = function(body) {
                // Store the result in cache
                redisClient.setEx(key, duration, JSON.stringify(body))
                    .catch(err => console.error('Cache save error:', err));
                return originalSend.call(this, body);
            };
            
            next();
        } catch (error) {
            console.error('Cache middleware error:', error);
            // Continue without caching on error
            next(); 
        }
    };
};

const clearCache = async (pattern) => {
    try {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
        return true;
    } catch (error) {
        console.error('Clear cache error:', error);
        return false;
    }
};

module.exports = { cacheMiddleware, clearCache }; 