require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter = require("./routes/userRouter");

// set up express
const app = express();
app.use(bodyParser.json({ extended: false }));
app.use(cors());

// route
app.use("/users", userRouter);

const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to Database!");
    app.listen(PORT, () =>
      console.log(`The server has started on port: ${PORT}`)
    );
  })
  .catch((err) => console.log(err));
