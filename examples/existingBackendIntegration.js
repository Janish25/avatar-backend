// Example: Integration with existing backend
// Place this in your existing backend routes file

const express = require('express');
const router = express.Router();
const axios = require('axios');

// Your existing imports
const { CreateRPMUser } = require('../services/readyPlayerMeService');
const userServices = require('../services/userServices');
const logger = require('../utils/logger');
const MessageBuilder = require('../utils/messageBuilder');

/**
 * NEW: Create user with custom avatar (instead of RPM)
 * This replaces the Ready Player Me integration
 */
exports.createUserWithAvatar = async (req, res, next) => {
    try {
        const { adUserId, avatar, avatarUrl, gender } = req.body;

        // Validate UUID (same as before)
        if (!uuidChecker(adUserId)) {
            return res.status(400).json(
                MessageBuilder(null, true, "Invalid User Id. Please provide a valid UUID.")
            );
        }

        // Check if user already exists
        const existingUser = await userServices.findUserByAdUserId(adUserId);
        if (existingUser) {
            logger.error("Avatar already exists");
            return res.status(400).json(
                MessageBuilder(null, true, "Avatar already exists")
            );
        }

        // Create avatar record in your database
        // Instead of calling RPM API, we save the selected avatar
        const avatarData = {
            avatarType: avatar,        // e.g., 'male1', 'female2'
            avatarUrl: avatarUrl,      // GLB model URL
            gender: gender,            // 'male' or 'female'
            source: 'custom-creator'   // To distinguish from RPM avatars
        };

        await userServices.createUser({
            adUserId: adUserId,
            avatar: avatarData,
            ...req.body
        });

        res.status(201).json(
            MessageBuilder(null, false, "Avatar created successfully")
        );
        logger.info("Avatar created successfully");
    } catch (error) {
        next(error);
        logger.error("Error in creating avatar", { error });
    }
};

/**
 * UPDATED: Update user avatar
 */
exports.updateUserAvatar = async (req, res, next) => {
    const adUserId = req.authInfo?.oid || req.params.adUserId;
    
    try {
        const { avatar, avatarUrl, gender } = req.body;

        if (!avatar || !avatarUrl) {
            logger.warn("Bad request: Missing required fields");
            return res.status(400).json(
                MessageBuilder(null, true, "Bad request: Missing avatar data")
            );
        }

        const avatarData = {
            avatarType: avatar,
            avatarUrl: avatarUrl,
            gender: gender,
            source: 'custom-creator',
            updatedAt: new Date()
        };

        const result = await userServices.updateUserAvatar(adUserId, avatarData);

        if (result) {
            res.status(200).json(
                MessageBuilder(null, false, "Avatar updated successfully")
            );
            logger.info("Avatar updated successfully");
        } else {
            res.status(404).json(
                MessageBuilder(null, false, "Avatar not found")
            );
            logger.warn(`Avatar not found for id ${adUserId}`);
        }
    } catch (error) {
        next(error);
        logger.error("Error in updating Avatar", { error, id: adUserId });
    }
};

/**
 * Get user avatar data
 */
exports.getUserAvatar = async (req, res, next) => {
    const adUserId = req.authInfo?.oid || req.params.adUserId;

    try {
        const user = await userServices.findUserByAdUserId(adUserId);

        if (!user) {
            return res.status(404).json(
                MessageBuilder(null, true, "Avatar not found")
            );
        }

        res.status(200).json(
            MessageBuilder(user.avatar, false, "Avatar retrieved successfully")
        );
    } catch (error) {
        next(error);
        logger.error("Error in getting avatar", { error, id: adUserId });
    }
};

module.exports = {
    createUserWithAvatar,
    updateUserAvatar,
    getUserAvatar
};
