import * as mongoose from "mongoose";
import { dbConfig } from "./dbConfig";

export const connectDB = async () => {
  try {
    await mongoose.connect(dbConfig.mongoURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log(`Higher powers spread data from MongoDB`);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
