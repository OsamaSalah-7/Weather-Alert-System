import mongoose, { Document } from "mongoose";

export interface WeatherEntry extends Document {
  record_time: Date | null;
  air_pres: number;
  air_temp: number;
  water_temp: number;
  wind_dir: number;
  wind_speed: number;
}

const weatherSchema = new mongoose.Schema<WeatherEntry>({
  record_time: { type: Date, required: false },
  air_pres: { type: Number, default: 0 },
  air_temp: { type: Number, default: 0 },
  water_temp: { type: Number, default: 0 },
  wind_dir: { type: Number, default: 0 },
  wind_speed: { type: Number, default: 0 },
});

const WeatherData = mongoose.model<WeatherEntry>("WeatherData", weatherSchema);
export default WeatherData;
