const express = require("express");
const { spammedUser, getAllSpammedUsers, deleteSpammedUser } = require('../controllers/spamController');

const router = express.Router();

router.post("/spammedUser", spammedUser);
router.get("/getUser", getAllSpammedUsers);
router.delete("/deleteUser/:id", deleteSpammedUser);

module.exports = router;