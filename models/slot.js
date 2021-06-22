const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SlotSchema = new Schema({
      today: {
            type: Object,
            required: true
      },
      tomorrow: {
            type: Object,
            required: true
      }

}, { timestamps: false });

const Slot = mongoose.model('Slot', SlotSchema);
module.exports = Slot;