const axios = require('axios');
const logger = require('../utils/logger');
const MessageBuilder = require('../utils/messageBuilder');

// Replace this with your deployed avatar creator URL
const avatarCreatorPath = process.env.AVATAR_CREATOR_API || 'http://localhost:5000/api';

module.exports = {
    /**
     * Create avatar user (replaces CreateRPMUser)
     * @param {string} adUserId - Active Directory User ID
     * @param {object} avatarData - Avatar selection data
     * @returns {Promise<string>} Avatar ID
     */
    'CreateAvatarUser': async (adUserId, avatarData) => {
        try {
            const body = {
                adUserId: adUserId,
                avatar: avatarData.avatar,      // e.g., 'male1', 'female2'
                avatarUrl: avatarData.avatarUrl, // GLB model URL
                gender: avatarData.gender        // 'male' or 'female'
            };

            const response = await axios.post(
                `${avatarCreatorPath}/avatar`,
                body
            );

            const avatarId = response.data.data.id;
            logger.info(`Custom avatar created for user: ${adUserId}`);
            return avatarId;
        } catch (error) {
            logger.error(`Error creating custom avatar: ${error}`);
            return null;
        }
    },

    /**
     * Get avatar by user ID
     * @param {string} adUserId - Active Directory User ID
     * @returns {Promise<object>} Avatar data
     */
    'GetAvatarByUserId': async (adUserId) => {
        try {
            const response = await axios.get(
                `${avatarCreatorPath}/avatar/${adUserId}`
            );

            if (response.data.error) {
                return null;
            }

            logger.info(`Avatar fetched for user: ${adUserId}`);
            return response.data.data;
        } catch (error) {
            logger.error(`Error fetching avatar: ${error}`);
            return null;
        }
    },

    /**
     * Update avatar
     * @param {string} adUserId - Active Directory User ID
     * @param {object} avatarData - Updated avatar data
     * @returns {Promise<boolean>} Success status
     */
    'UpdateAvatar': async (adUserId, avatarData) => {
        try {
            const body = {
                avatar: avatarData.avatar,
                avatarUrl: avatarData.avatarUrl,
                gender: avatarData.gender
            };

            const response = await axios.put(
                `${avatarCreatorPath}/avatar/${adUserId}`,
                body
            );

            logger.info(`Avatar updated for user: ${adUserId}`);
            return !response.data.error;
        } catch (error) {
            logger.error(`Error updating avatar: ${error}`);
            return false;
        }
    },

    /**
     * Delete avatar
     * @param {string} adUserId - Active Directory User ID
     * @returns {Promise<boolean>} Success status
     */
    'DeleteAvatar': async (adUserId) => {
        try {
            const response = await axios.delete(
                `${avatarCreatorPath}/avatar/${adUserId}`
            );

            logger.info(`Avatar deleted for user: ${adUserId}`);
            return !response.data.error;
        } catch (error) {
            logger.error(`Error deleting avatar: ${error}`);
            return false;
        }
    }
};
