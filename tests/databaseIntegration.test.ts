import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import WeatherData from "../src/models/WeatherData";
import connectDB from "../src/config/database";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri();
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

it("should insert weather data into MongoDB", async () => {
  const weatherEntry = new WeatherData({
    record_time: new Date(),
    air_pres: 1012,
    air_temp: 25,
    water_temp: 20,
    wind_dir: 180,
    wind_speed: 10,
  });

  await weatherEntry.save();
  const foundEntry = await WeatherData.findOne({ air_temp: 25 });

  expect(foundEntry).toBeTruthy();
  expect(foundEntry?.wind_speed).toBe(10);
});
