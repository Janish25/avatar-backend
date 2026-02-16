const express = require('express');
const cors = require('cors');
const avatarRoutes = require('./routes/avatarRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection (Optional - uncomment if using MongoDB)
/*
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/avatar_db';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));
*/

// Routes
app.use('/api', avatarRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        data: null,
        error: true,
        message: err.message || 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        data: null,
        error: true,
        message: 'Route not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Avatar Backend Server is running on port ${PORT}`);
    console.log(`📍 API endpoint: http://localhost:${PORT}/api`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
