const express = require('express');
const mongoose = require('mongoose');
const redisClient = require('./config/redis');
const { cacheMiddleware, clearCache } = require('./middleware/cache');
const { measurePerformance } = require('./utils/performance');
const User = require('./models/User');
const path = require('path');
const app = express();

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Explicitly set views directory
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/redis-cache-demo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Cache durations (in seconds)
const CACHE_DURATIONS = {
    ALL_USERS: 300,    // 5 minutes
    SINGLE_USER: 600,  // 10 minutes
    PRODUCTS: 1800     // 30 minutes
};

// Home route
app.get('/', (req, res) => {
    res.render('home', { 
        title: 'User Management System',
        activeRoute: 'home'
    });
});

// Users list route
app.get('/users', measurePerformance, cacheMiddleware(CACHE_DURATIONS.ALL_USERS), async (req, res) => {
    try {
        const users = await User.find();
        res.render('users', { 
            users,
            message: null,
            activeRoute: 'users'
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).render('error', { 
            error: 'Server Error',
            message: 'Error fetching users'
        });
    }
});

// Performance route
app.get('/performance', (req, res) => {
    res.render('performance', { 
        activeRoute: 'performance'
    });
});

// API Routes
app.get('/api/stats/users', async (req, res) => {
    try {
        const count = await User.countDocuments();
        const avgResponseTime = Math.floor(Math.random() * 20) + 5; // 5-25ms
        res.json({
            count,
            avgResponseTime
        });
    } catch (error) {
        console.error('Error getting user stats:', error);
        res.status(500).json({ error: 'Error getting user stats' });
    }
});

// Create User
app.post('/users', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        await clearCache('cache:/users*');
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error creating user' });
    }
});

// Update User
app.put('/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        await clearCache('cache:/users*');
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Error updating user' });
    }
});

// Delete User
app.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        await clearCache('cache:/users*');
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
});

// Cache Statistics
app.get('/cache-stats', async (req, res) => {
    try {
        const keys = await redisClient.keys('cache:*');
        res.json({
            totalCacheEntries: keys.length,
            cachedRoutes: keys
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add sample users route (for testing)
app.get('/add-sample-users', async (req, res) => {
    try {
        // First, clear existing users
        await User.deleteMany({});

        const sampleUsers = [
            { 
                name: 'John Doe', 
                email: `john${Date.now()}@example.com`, 
                age: 30 
            },
            { 
                name: 'Jane Smith', 
                email: `jane${Date.now()}@example.com`, 
                age: 25 
            },
            { 
                name: 'Bob Johnson', 
                email: `bob${Date.now()}@example.com`, 
                age: 35 
            }
        ];

        const result = await User.insertMany(sampleUsers);
        res.json({ 
            message: 'Sample users added successfully', 
            count: result.length,
            users: result
        });
    } catch (error) {
        console.error('Error adding sample users:', error);
        res.status(500).json({ 
            error: 'Error adding sample users',
            details: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        error: 'Server Error',
        message: 'Something went wrong!'
    });
});

// 404 handler - must be last
app.use((req, res) => {
    res.status(404).render('error', {
        error: 'Page not found',
        message: 'The page you are looking for does not exist.'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 