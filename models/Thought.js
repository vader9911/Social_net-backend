const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reactionSchema = require("./Reaction");

// Define Thought
const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: true,
    maxlength: 280,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (createdAt) => createdAt.toLocaleString(), // Format date on query
  },
  username: {
    type: String,
    required: true,
  },
  reactions: [{ type: Schema.Types.ObjectId, ref: "Reaction" }],
});

// virtual to get the number of reactions for a comment
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

module.exports = mongoose.model("Thought", thoughtSchema);
