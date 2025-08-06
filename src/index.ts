import dotenv from "dotenv";
import connectDB from "./config/database";
import processCSV from "./services/csvProcessor";
import checkAlerts from "./services/alertChecker";

dotenv.config();

const run = async () => {
  console.log("Weather Alert System started.");
  await connectDB();
  await processCSV("data/weather_data.csv");
  await checkAlerts();
  console.log("Weather Alert System completed.");
  process.exit();
};

run();