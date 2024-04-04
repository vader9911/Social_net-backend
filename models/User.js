const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define user 
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // regex for email matching
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  },
  thoughts: [{ type: Schema.Types.ObjectId, ref: 'Thought' }],
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

// virtual to get the number of friends for a user
userSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

module.exports = mongoose.model('User', userSchema);