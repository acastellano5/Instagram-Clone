const BaseJoi = require('joi')
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.postSchema = Joi.object({
    caption: Joi.string().required().escapeHTML()
})

module.exports.commentSchema = Joi.object({
    text: Joi.string().required().escapeHTML()
})

module.exports.userSchema = Joi.object({
    fullName:  Joi.string().required().escapeHTML(), 
    username: Joi.string().required().escapeHTML(), 
    bio: Joi.string().allow('').optional().escapeHTML()
})