# 🚨 Weather Alert System

Objective:
Build a Weather Alert System that monitors and analyzes weather data from a CSV file, stores it in MongoDB, and triggers alerts based on predefined weather thresholds (e.g., wind speed, temperature, pressure).

Phase 0: Warm-Up
--
* Install lastest NodeJS
* Refresh your knowledge of Typescript and Git.
* Read about NPM for package management.
* Checkout MongoDB & CSV.


Phase 1:  Weather Alert System setup
--

* Set up NodeJs with Typescript project.
* Use ES6 and eslint.
* Install Mongo locally or use Mongo atlas free tier.


Phase 2: Weather Alert System Core
--
Here are all possible weather alerts you can implement based on your [dataset](https://www.kaggle.com/datasets/zain053/tempreture-data-2012-to-2022?resource=download
) (`record_time, air_pres, air_temp, water_temp, wind_dir, wind_speed`): 

- record_time → Timestamp (YYYY-MM-DD HH:MM:SS)
- air_pres (Air Pressure) → hPa (hectopascals)
- air_temp (Air Temperature) → °C (degrees Celsius)
- water_temp (Water Temperature) → °C (degrees Celsius)
- wind_dir (Wind Direction) → ° (degrees, measured clockwise from true north)
- wind_speed (Wind Speed) → km/h (kilometers per hour)

---

## **🌪️ Extreme Weather Alerts**  

### **1️⃣ Wind Alerts**  
- 🚨 **High Wind Speed Alert** → Wind speed exceeds **80 km/h** (storm level).  
- 🌬️ **Strong Wind Advisory** → Wind speed between **40-80 km/h**.  
- 🍃 **Calm Wind Alert** → Wind speed below **2 km/h** (no movement).  

### **2️⃣ Temperature Alerts**  
- ❄️ **Extreme Cold Alert** → Air temperature drops **below -10°C**.  
- 🔥 **Heatwave Alert** → Air temperature exceeds **40°C**.  
- 🌡️ **Rapid Temperature Drop Alert** → Sudden drop **>10°C** in an hour.  

### **3️⃣ Water Temperature Alerts**  
- 🌊 **Cold Water Alert** → Water temperature **below 5°C** (risk of hypothermia).  
- 🌊 **Hot Water Alert** → Water temperature **above 30°C** (risk of algae bloom).  

### **4️⃣ Air Pressure Alerts**  
- ⚠️ **Low Pressure Alert** → Air pressure below **980 hPa** (indicates storm).  
- ⚠️ **High Pressure Alert** → Air pressure above **1030 hPa** (clear but dry weather).  
- 📉 **Rapid Pressure Drop Alert** → Drop **>10 hPa in 3 hours** (storm coming).  

### **5️⃣ Wind Direction Alerts**  
- 🧭 **Sudden Wind Shift Alert** → Wind direction changes **>90° in an hour** (could indicate incoming weather changes).  


## **⛈️ Storm & Dangerous Weather Warnings**  
- 🌪️ **Hurricane Alert** → Wind speed **>120 km/h** + Low Pressure **<970 hPa**.  
- ⚡ **Lightning Storm Alert** → Wind speed **>60 km/h** + Sudden pressure drop.  
- 🌊 **Tsunami Risk Alert** → Rapid water temperature increase + low air pressure.  
- 🌫️ **Fog Alert** → Air temp and dew point are close + wind speed low.  



Phase 3: Testing
-- 

Write unit and integration tests for the system. Use Jest for testing:
- Test CSV parsing and data loading into MongoDB.
- Test weather alert logic and ensure alerts are triggered correctly.



Phase 4: Github Action
-- 
Set up a GitHub Actions workflow that automatically runs Node.js tests on every push and pull request to ensure code quality and stability.
  


# Side Task:
- Read and understand LZ77 Algo ( Must )
- XSS ( Must ).

