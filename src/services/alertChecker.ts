import WeatherData from "../models/WeatherData";
import Alert from "../models/Alerts";

interface WeatherEntry {
  record_time: Date;
  wind_speed: number;
  air_temp: number;
  water_temp: number;
  air_pres: number;
  wind_dir: number;
  dew_point?: number;
}

interface AlertEntry {
  record_time: Date;
  type: string;
  message: string;
}

const generateAlert = (date: string, type: string, message: string, entry: WeatherEntry, dailyAlerts: { [date: string]: { [type: string]: AlertEntry } }) => {
  if (!dailyAlerts[date]) dailyAlerts[date] = {};
  if (!dailyAlerts[date][type]) {
    dailyAlerts[date][type] = { record_time: entry.record_time, type, message };
  }
};

const checkAlerts = async () => {
  console.log("Checking weather alerts...");

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);

  let skip = 0;
  const limit = 30000;

  while (true) {
    const data = await WeatherData.find<WeatherEntry>().sort({ record_time: 1 }).skip(skip).limit(limit);
    if (data.length === 0) break;
    console.log(`Processing ${data.length} entries (chunk starting at ${skip})...`);
    
    const dailyAlerts: { [date: string]: { [type: string]: AlertEntry } } = {};

    for (let i = 0; i < data.length; i++) {
      const entry = data[i];
      const date = entry.record_time.toISOString().split("T")[0];
      
      // Wind Alerts
      if (entry.wind_speed > 80) generateAlert(date, "Wind_High", "High Wind Speed Alert (>80 km/h)", entry, dailyAlerts);
      if (entry.wind_speed >= 40 && entry.wind_speed <= 80) generateAlert(date, "Wind_Strong", "Strong Wind Advisory (40-80 km/h)", entry, dailyAlerts);
      if (entry.wind_speed < 2) generateAlert(date, "Wind_Calm", "Calm Wind Alert (<2 km/h)", entry, dailyAlerts);

      // Temperature Alerts
      if (entry.air_temp < -10) generateAlert(date, "Temp_Cold", "Extreme Cold Alert (<-10°C)", entry, dailyAlerts);
      if (entry.air_temp > 40) generateAlert(date, "Temp_Hot", "Heatwave Alert (>40°C)", entry, dailyAlerts);
      
      if (i >= 60) {
        const prevEntry = data.find(d => d.record_time <= oneHourAgo);
        if (prevEntry && prevEntry.air_temp - entry.air_temp > 10) {
          generateAlert(date, "Temp_Drop", "Rapid Temperature Drop (>10°C in 1 hour)", entry, dailyAlerts);
        }
      }
      
      // Water Temperature Alerts
      if (entry.water_temp < 5) generateAlert(date, "Water_Cold", "Cold Water Alert (<5°C)", entry, dailyAlerts);
      if (entry.water_temp > 30) generateAlert(date, "Water_Hot", "Hot Water Alert (>30°C)", entry, dailyAlerts);
      
      // Air Pressure Alerts
      if (entry.air_pres < 980) generateAlert(date, "Pressure_Low", "Low Pressure Alert (<980 hPa)", entry, dailyAlerts);
      if (entry.air_pres > 1030) generateAlert(date, "Pressure_High", "High Pressure Alert (>1030 hPa)", entry, dailyAlerts);
      
      if (i >= 180) {
        const prevEntry = data.find(d => d.record_time <= threeHoursAgo);
        if (prevEntry && prevEntry.air_pres - entry.air_pres > 10) {
          generateAlert(date, "Pressure_Drop", "Rapid Pressure Drop (>10 hPa in 3 hours)", entry, dailyAlerts);
        }
      }
      
      // Wind Direction Shift Alert
      if (i >= 60) {
        const prevEntry = data.find(d => d.record_time <= oneHourAgo);
        if (prevEntry && Math.abs(prevEntry.wind_dir - entry.wind_dir) > 90) {
          generateAlert(date, "Wind_Shift", "Sudden Wind Shift (>90° in 1 hour)", entry, dailyAlerts);
        }
      }
      
      // Hurricane Alert
      if (entry.wind_speed > 120 && entry.air_pres < 970) generateAlert(date, "Hurricane", "Hurricane Alert (Wind >120 km/h & Pressure <970 hPa)", entry, dailyAlerts);

      // Lightning Storm Alert
      if (entry.wind_speed > 60 && data.some(d => d.air_pres - entry.air_pres > 10)) {
        generateAlert(date, "Lightning", "Lightning Storm Alert (Wind >60 km/h & Sudden Pressure Drop)", entry, dailyAlerts);
      }
      
      // Tsunami Alert
      if (data.some(d => d.water_temp !== undefined && entry.water_temp !== undefined && d.water_temp - entry.water_temp > 5) && entry.air_pres < 980) {
        generateAlert(date, "Tsunami", "Tsunami Risk Alert (Rapid Water Temp Increase & Low Pressure)", entry, dailyAlerts);
      }
      
      // Fog Alert
      if (entry.dew_point !== undefined && Math.abs(entry.air_temp - entry.dew_point) < 2 && entry.wind_speed < 10) {
        generateAlert(date, "Fog", "Fog Alert (Air Temp and Dew Point Close & Low Wind Speed)", entry, dailyAlerts);
      }
    }

    for (const date in dailyAlerts) {
      const alertsForDay = Object.values(dailyAlerts[date]);
      if (alertsForDay.length > 0) {
        try {
          const existingAlert = await Alert.findOne({ record_time: { $gte: new Date(date), $lt: new Date(`${date}T23:59:59.999`) } });
          if (!existingAlert) {
            await Alert.insertMany(alertsForDay);
            console.log(`${alertsForDay.length} alerts stored in MongoDB for ${date}.`);
          } else {
            console.log(`Alert already exists for ${date}. Skipping insertion.`);
          }
        } catch (error) {
          console.error(`Error inserting alerts for ${date}:`, error);
        }
      } else {
        console.log(`No alerts detected for ${date}.`);
      }
    }

    skip += limit;
  }
  console.log("Alert checking completed.");
};

export default checkAlerts;
