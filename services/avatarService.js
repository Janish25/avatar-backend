const logger = require('../utils/logger');

// In-memory storage (use MongoDB for production)
const avatarStorage = new Map();

// Uncomment below for MongoDB support
// const Avatar = require('../models/Avatar');

// Service to handle avatar operations similar to ReadyPlayerMe
module.exports = {
    /**
     * Create avatar record in the system
     * @param {string} adUserId - Active Directory User ID
     * @param {object} avatarData - Avatar selection data
     * @returns {Promise<object>} Created avatar data
     */
    createAvatarRecord: async (adUserId, avatarData) => {
        try {
            // In-memory storage version
            const avatarRecord = {
                id: `avatar_${Date.now()}`,
                userId: adUserId,
                avatarType: avatarData.avatar,
                avatarUrl: avatarData.avatarUrl,
                gender: avatarData.gender,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            avatarStorage.set(adUserId, avatarRecord);
            logger.info(`Avatar record created for user: ${adUserId}`);
            return avatarRecord;

            /* MongoDB version - uncomment when MongoDB is set up
            const avatar = new Avatar({
                userId: adUserId,
                avatarType: avatarData.avatar,
                avatarUrl: avatarData.avatarUrl,
                gender: avatarData.gender,
                isActive: true
            });

            const savedAvatar = await avatar.save();
            logger.info(`Avatar record created for user: ${adUserId}`);
            return savedAvatar;
            */
        } catch (error) {
            logger.error(`Error creating avatar record: ${error}`);
            throw error;
        }
    },

    /**
     * Update existing avatar
     * @param {string} userId - User ID
     * @param {object} avatarData - Updated avatar data
     * @returns {Promise<object>} Updated avatar data
     */
    updateAvatarRecord: async (userId, avatarData) => {
        try {
            // In-memory storage version
            const existingAvatar = avatarStorage.get(userId);
            if (!existingAvatar) {
                throw new Error('Avatar not found');
            }

            const updatedAvatar = {
                ...existingAvatar,
                avatarType: avatarData.avatar,
                avatarUrl: avatarData.avatarUrl,
                gender: avatarData.gender,
                updatedAt: new Date()
            };

            avatarStorage.set(userId, updatedAvatar);
            logger.info(`Avatar record updated for user: ${userId}`);
            return updatedAvatar;

            /* MongoDB version - uncomment when MongoDB is set up
            const updatedAvatar = await Avatar.findOneAndUpdate(
                { userId: userId },
                {
                    avatarType: avatarData.avatar,
                    avatarUrl: avatarData.avatarUrl,
                    gender: avatarData.gender,
                    updatedAt: new Date()
                },
                { new: true }
            );

            if (!updatedAvatar) {
                throw new Error('Avatar not found');
            }

            logger.info(`Avatar record updated for user: ${userId}`);
            return updatedAvatar;
            */
        } catch (error) {
            logger.error(`Error updating avatar record: ${error}`);
            throw error;
        }
    },

    /**
     * Get avatar by user ID
     * @param {string} adUserId - Active Directory User ID
     * @returns {Promise<object>} Avatar data
     */
    getAvatarByUserId: async (adUserId) => {
        try {
            // In-memory storage version
            const avatar = avatarStorage.get(adUserId);
            logger.info(`Fetching avatar for user: ${adUserId}`);
            return avatar || null;

            /* MongoDB version - uncomment when MongoDB is set up
            const avatar = await Avatar.findOne({ userId: adUserId, isActive: true });
            logger.info(`Fetching avatar for user: ${adUserId}`);
            return avatar;
            */
        } catch (error) {
            logger.error(`Error fetching avatar: ${error}`);
            throw error;
        }
    },

    /**
     * Delete avatar (soft delete)
     * @param {string} adUserId - Active Directory User ID
     * @returns {Promise<boolean>} Success status
     */
    deleteAvatar: async (adUserId) => {
        try {
            // In-memory storage version
            const avatar = avatarStorage.get(adUserId);
            if (avatar) {
                avatar.isActive = false;
                avatar.updatedAt = new Date();
                avatarStorage.set(adUserId, avatar);
                logger.info(`Avatar deleted for user: ${adUserId}`);
                return true;
            }
            return false;

            /* MongoDB version - uncomment when MongoDB is set up
            const result = await Avatar.findOneAndUpdate(
                { userId: adUserId },
                { isActive: false, updatedAt: new Date() },
                { new: true }
            );

            logger.info(`Avatar deleted for user: ${adUserId}`);
            return !!result;
            */
        } catch (error) {
            logger.error(`Error deleting avatar: ${error}`);
            throw error;
        }
    }
};
