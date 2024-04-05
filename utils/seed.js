const mongoose = require("mongoose");
const { User, Thought } = require("../models");

mongoose
  .connect("mongodb://localhost:27017/socialBackend", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany();
    await Thought.deleteMany();

    // Create users
    const user1 = await User.create({
      username: "user1",
      email: "user1@example.com",
    });
    const user2 = await User.create({
      username: "user2",
      email: "user2@example.com",
    });

    // Create thoughts
    const thought1 = await Thought.create({
      thoughtText: "Thought 1",
      username: user1.username,
      userId: user1._id,
    });
    const thought2 = await Thought.create({
      thoughtText: "Thought 2",
      username: user2.username,
      userId: user2._id,
    });

    // Add friends
    await User.findByIdAndUpdate(user1._id, { $push: { friends: user2._id } });
    await User.findByIdAndUpdate(user2._id, { $push: { friends: user1._id } });

    console.log("Seed data inserted successfully");

    // Close connection
    mongoose.connection.close();
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));
