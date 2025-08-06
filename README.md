📄 Project Documentation: Weather Alert System
🧾 Overview
The Weather Alert System monitors real-time weather data from a CSV file, stores it in MongoDB, and triggers alerts when critical weather thresholds are crossed.
Developed in TypeScript using Node.js, it supports structured parsing, storage, and alert logic for multiple weather phenomena.

🧩 Technologies Used
Node.js + TypeScript

MongoDB (with Mongoose)

CSV Parsing

ESLint for linting

Jest for testing

🌦️ Alerts & Conditions
Wind Alerts
🚨 High Wind Speed: > 80 km/h

🌬️ Strong Wind Advisory: 40–80 km/h

🍃 Calm Wind: < 2 km/h

Temperature Alerts
❄️ Extreme Cold: < -10°C

🔥 Heatwave: > 40°C

🌡️ Rapid Drop: >10°C/hour

Water Temperature
🌊 Cold: < 5°C

🌊 Hot: > 30°C

Air Pressure
⚠️ Low Pressure: < 980 hPa

⚠️ High Pressure: > 1030 hPa

📉 Rapid Drop: >10 hPa in 3 hours

Wind Direction
🧭 Sudden Shift: >90° change in 1 hour

Combined Alerts
🌪️ Hurricane: Wind >120 km/h + Pressure <970 hPa

⚡ Lightning Storm: Wind >60 km/h + Rapid Pressure Drop

🌊 Tsunami Risk: Rapid water temp rise + low pressure

🌫️ Fog: Air temp ≈ dew point + low wind speed

⚙️ System Architecture
Data Parser: Reads and parses CSV into structured weather entries.

MongoDB Storage: Saves weather data using Mongoose schemas.

Alert Engine: Evaluates data against thresholds to trigger alerts.

Scheduler (Optional): Periodic CSV ingestion.

Testing: Unit tests for parsing, alert triggering, and database ops.

🧪 Testing
Implemented with Jest, covering:

CSV data parsing

MongoDB write/read logic

Alert rule evaluations

📌 CV Summary Entry
Weather Alert System
Tech Stack: Node.js, TypeScript, MongoDB, Jest

Developed a weather monitoring and alert system that parses CSV data, stores it in MongoDB, and triggers alerts for critical weather conditions. Implemented multiple alert types (e.g., high winds, rapid pressure drops, hurricanes), structured with modular TypeScript services, and ensured reliability through unit testing with Jest.
🛠️ Setup & Usage
Prerequisites
Node.js (v18+ recommended)
MongoDB (local or remote instance)
Installation
git clone https://github.com/mkittani/Weather-Alert-System.git
cd Weather-Alert-System
npm install
Configuration
Create a .env file in the root directory:

DB_URI=mongodb://localhost:27017/weatherAlertsDB
DATASET_PATH=./path/to/your/weather.csv
Running the Application
npm start -- ./path/to/your/weather.csv
# or rely on DATASET_PATH in .env
npm start
Running Tests
npm test
🧪 Example CSV Format
record_time	air_pres	air_temp	water_temp	wind_dir	wind_speed
2024-06-01T12:00:00Z	1012	25	20	180	15
...	...	...	...	...	...

🛡️ Testing
Tests are located in src/tests/
Run with npm test
Covers alert logic, CSV parsing, and service integration
📚 Dependencies
Node.js
TypeScript
Mongoose
csv-parser
pino
dotenv
Jest (for testing)
