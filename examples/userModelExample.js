/**
 * Example: Updated User Model/Schema
 * 
 * This shows how to modify your existing User model to support
 * both Ready Player Me AND custom avatar creator
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    adUserId: {
        type: String,
        required: true,
        unique: true
    },
    
    // OPTIONAL: Keep RPM support for backward compatibility
    rpmId: {
        type: String,
        required: false  // Make optional if supporting both systems
    },

    // NEW: Avatar configuration
    avatar: {
        // Avatar source: 'rpm' or 'custom-creator'
        source: {
            type: String,
            enum: ['rpm', 'custom-creator'],
            default: 'custom-creator'
        },
        
        // For custom creator
        avatarType: {
            type: String,
            enum: ['male1', 'male2', 'male3', 'female1', 'female2'],
            required: false
        },
        
        // Avatar GLB URL (works for both RPM and custom)
        avatarUrl: {
            type: String,
            required: true
        },
        
        // Gender
        gender: {
            type: String,
            enum: ['male', 'female'],
            required: true
        },
        
        // Additional customization data (optional)
        customization: {
            skinTone: String,
            hairStyle: String,
            outfit: String,
            // Add more customization options as needed
        },
        
        // Timestamps
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },

    // Your other existing fields
    email: String,
    name: String,
    // ...
});

// Update timestamp on save
userSchema.pre('save', function(next) {
    if (this.avatar) {
        this.avatar.updatedAt = new Date();
    }
    next();
});

module.exports = mongoose.model('User', userSchema);


/**
 * Alternative: Separate Avatar Collection
 * 
 * If you prefer to keep avatars in a separate collection:
 */

const avatarSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    adUserId: {
        type: String,
        required: true,
        index: true
    },
    source: {
        type: String,
        enum: ['rpm', 'custom-creator'],
        default: 'custom-creator'
    },
    avatarType: String,
    avatarUrl: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    metadata: {
        type: Map,
        of: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Avatar', avatarSchema);
