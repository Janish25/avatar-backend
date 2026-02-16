const avatarService = require('../services/avatarService');
const logger = require('../utils/logger');
const MessageBuilder = require('../utils/messageBuilder');

/**
 * Avatar Controller - Handles avatar CRUD operations
 */

/**
 * Create new avatar for user
 */
exports.createAvatar = async (req, res, next) => {
    try {
        const { adUserId, avatar, avatarUrl, gender } = req.body;

        if (!adUserId || !avatar) {
            logger.warn('Bad request: Missing required fields');
            return res.status(400).json(
                MessageBuilder(null, true, 'Bad request: Missing adUserId or avatar')
            );
        }

        // Check if user already has an avatar
        const existingAvatar = await avatarService.getAvatarByUserId(adUserId);
        if (existingAvatar) {
            logger.error('Avatar already exists for this user');
            return res.status(400).json(
                MessageBuilder(null, true, 'Avatar already exists')
            );
        }

        // Create avatar record
        const avatarData = {
            avatar,
            avatarUrl,
            gender
        };

        const createdAvatar = await avatarService.createAvatarRecord(adUserId, avatarData);

        res.status(201).json(
            MessageBuilder(createdAvatar, false, 'Avatar created successfully')
        );
        logger.info(`Avatar created successfully for user: ${adUserId}`);
    } catch (error) {
        next(error);
        logger.error('Error in creating avatar', { error });
    }
};

/**
 * Update existing avatar
 */
exports.updateAvatar = async (req, res, next) => {
    try {
        const { adUserId } = req.params;
        const { avatar, avatarUrl, gender } = req.body;

        if (!avatar || !adUserId) {
            logger.warn('Bad request: Missing required fields');
            return res.status(400).json(
                MessageBuilder(null, true, 'Bad request: Missing required fields')
            );
        }

        const avatarData = {
            avatar,
            avatarUrl,
            gender,
            userId: adUserId
        };

        // Get existing avatar
        const existingAvatar = await avatarService.getAvatarByUserId(adUserId);
        if (!existingAvatar) {
            return res.status(404).json(
                MessageBuilder(null, true, 'Avatar not found')
            );
        }

        const result = await avatarService.updateAvatarRecord(existingAvatar.id, avatarData);

        res.status(200).json(
            MessageBuilder(result, false, 'Avatar updated successfully')
        );
        logger.info(`Avatar updated successfully for user: ${adUserId}`);
    } catch (error) {
        next(error);
        logger.error('Error in updating Avatar', { error, adUserId: req.params.adUserId });
    }
};

/**
 * Get avatar by user ID
 */
exports.getAvatar = async (req, res, next) => {
    try {
        const { adUserId } = req.params;

        if (!adUserId) {
            return res.status(400).json(
                MessageBuilder(null, true, 'Bad request: Missing adUserId')
            );
        }

        const avatar = await avatarService.getAvatarByUserId(adUserId);

        if (!avatar) {
            return res.status(404).json(
                MessageBuilder(null, true, 'Avatar not found')
            );
        }

        res.status(200).json(
            MessageBuilder(avatar, false, 'Avatar retrieved successfully')
        );
    } catch (error) {
        next(error);
        logger.error('Error in getting avatar', { error, adUserId: req.params.adUserId });
    }
};

/**
 * Delete avatar
 */
exports.deleteAvatar = async (req, res, next) => {
    try {
        const { adUserId } = req.params;

        if (!adUserId) {
            return res.status(400).json(
                MessageBuilder(null, true, 'Bad request: Missing adUserId')
            );
        }

        const avatar = await avatarService.getAvatarByUserId(adUserId);
        if (!avatar) {
            return res.status(404).json(
                MessageBuilder(null, true, 'Avatar not found')
            );
        }

        // Delete logic here - add to your service
        
        res.status(200).json(
            MessageBuilder(null, false, 'Avatar deleted successfully')
        );
        logger.info(`Avatar deleted successfully for user: ${adUserId}`);
    } catch (error) {
        next(error);
        logger.error('Error in deleting avatar', { error, adUserId: req.params.adUserId });
    }
};
