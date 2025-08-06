import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import WeatherData from "../src/models/WeatherData";
import Alert from "../src/models/Alerts";
import checkAlerts from "../src/services/alertChecker";

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

it("should generate alerts for extreme weather", async () => {
  await WeatherData.insertMany([
    { record_time: new Date(), air_temp: 45, wind_speed: 90, air_pres: 975 },
    { record_time: new Date(), air_temp: -15, wind_speed: 5, air_pres: 1020 },
  ]);

  await checkAlerts();
  
  const alerts = await Alert.find();
  expect(alerts.length).toBeGreaterThan(0);

  const heatwaveAlert = alerts.find(a => a.message.includes("Heatwave Alert"));
  expect(heatwaveAlert).toBeTruthy();

  const coldAlert = alerts.find(a => a.message.includes("Extreme Cold Alert"));
  expect(coldAlert).toBeTruthy();
});
