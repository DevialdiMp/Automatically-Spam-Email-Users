const express = require("express");
const dotenv = require("dotenv");
const spamRoutes = require("./routes/index");

dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/users", spamRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Hallo! Devialdi Maisa Putra");
    console.log(`Server berjalan pada port ${PORT}`);
});
