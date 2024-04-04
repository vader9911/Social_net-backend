const express = require("express");
const router = express.Router();
const { Thought, User } = require("../../models");

// GET all thoughts
router.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find();
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


module.exports = router;
