const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AppSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    day: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', AppSchema);
module.exports = Appointment;