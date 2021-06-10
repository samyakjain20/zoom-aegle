const mongoose = require('mongoose');
const Schema =mongoose.Schema;

const webinarSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    dateTime: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true
    },
}, {timestamps: true});

const Webinar = mongoose.model('Webinar', webinarSchema);
module.exports = Webinar;