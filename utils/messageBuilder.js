/**
 * Build standardized API response
 * @param {*} data - Response data
 * @param {boolean} error - Whether this is an error response
 * @param {string} message - Response message
 * @returns {object} Formatted response
 */
const MessageBuilder = (data, error, message) => {
    return {
        data: data,
        error: error,
        message: message
    };
};

module.exports = MessageBuilder;
