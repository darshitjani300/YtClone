// require("dotenv").config({path: "./env"});
import dotenv from "dotenv";
import connectDb from "./db/db.js";

dotenv.config({
  path: "./env",
});

connectDb();

/*
const app = express()
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("ERRRRR: ", error);
      throw error;
    });
    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
})();

*/
