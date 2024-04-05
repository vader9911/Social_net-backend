const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define reaction
const reactionSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
    required: true
  },
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280
  },
  username: {
    type: String,
    required: true
  },
  // Set date for current time
  createdAt: {
    type: Date,
    default: Date.now,
    get: (createdAt) => createdAt.toLocaleString() 
  }
});

const Reaction = mongoose.model('Reaction', reactionSchema);
// Export reaction to be used in Thought schema
module.exports = Reaction;
