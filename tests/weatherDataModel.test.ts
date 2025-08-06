import mongoose from "mongoose";
import dotenv from "dotenv";
import WeatherData from "../src/models/WeatherData";

dotenv.config(); // Load environment variables

const dbURI = process.env.MONGODB_URI ; // Use test DB for tests

describe("WeatherData Model", () => {
  beforeAll(async () => {
    if (!dbURI) throw new Error("Database URI is not defined");
    await mongoose.connect(dbURI);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should save weather data correctly", async () => {
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
});
