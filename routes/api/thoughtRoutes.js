const express = require("express");
const router = express.Router();
const { Thought, User, Reaction } = require("../../models");

// GET all thoughts
router.get("/thoughts", async (req, res) => {
    try {
      // Retrieve all thoughts from the database
      const thoughts = await Thought.find().populate({
        path: 'reactions',
        populate: {
          path: 'username', 
          select: 'username' 
        }
      });
  
      // Return the thoughts with populated reactions
      res.json(thoughts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// GET a single thought by its _id
router.get("/thoughts/:thoughtId", async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    res.json(thought);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST to create a new thought
router.post("/thoughts", async (req, res) => {
  try {
    const thought = new Thought(req.body);
    await thought.save();

    // Push the created thought's _id to the associated user's thoughts array field
    await User.findByIdAndUpdate(req.body.userId, {
      $push: { thoughts: thought._id },
    });

    res.status(201).json(thought);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT to update a thought by its _id
router.put("/thoughts/:thoughtId", async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      req.body,
      { new: true }
    );
    res.json(thought);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE to remove a thought by its _id
router.delete("/thoughts/:thoughtId", async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
    res.json(thought);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST to create a reaction stored in a single thought's reactions array field
router.post("/thoughts/:thoughtId/reactions", async (req, res) => {
    try {
      // Create a new Reaction instance 
      const reaction = new Reaction({
        reactionBody: req.body.reactionBody,
        username: req.body.username
      });
      await reaction.save();
      // Update the corresponding thought document to include the newly created reaction
      const thoughtId = req.params.thoughtId;
      let thought = await Thought.findById(thoughtId);
  
      if (!thought.reactions) {
        thought.reactions = [];
      }
      // Push the reaction's ObjectId to the reactions array in the thought document
      thought.reactions.push(reaction);
      await thought.save();
  
      res.status(201).json(reaction);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  
  // DELETE to pull and remove a reaction by the reaction's reactionId value
  router.delete("/thoughts/:thoughtId/reactions/:reactionId", async (req, res) => {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $pull: { reactions: req.params.reactionId } },
        { new: true }
      );
  
      // Check if the thought exists
      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }
  
      res.json(thought);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
