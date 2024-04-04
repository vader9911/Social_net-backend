const router = require("express").Router();
const thoughtRoutes = require('./thoughtRoutes');
const userRoutes = require("./userRoutes");

router.use('/', thoughtRoutes);
router.use("/", userRoutes);

module.exports = router;
