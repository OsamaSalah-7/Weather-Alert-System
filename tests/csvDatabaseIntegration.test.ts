import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import WeatherData from "../src/models/WeatherData";
import csvProcessor from "../src/services/csvProcessor";
import fs from "fs";
import path from "path";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri();
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

it("should process CSV and store data in MongoDB", async () => {
  const csvPath = path.join(__dirname, "test_weather_data.csv");
  fs.writeFileSync(csvPath, "record_time,air_pres,air_temp,water_temp,wind_dir,wind_speed\n2025-02-28T12:00:00Z,1012,25,20,180,10");

  await csvProcessor(csvPath);
  const foundEntry = await WeatherData.findOne({ air_temp: 25 });

  expect(foundEntry).toBeTruthy();
  expect(foundEntry?.wind_speed).toBe(10);

  fs.unlinkSync(csvPath);
});
