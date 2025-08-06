import fs from "fs";
import csv from "csv-parser";
import WeatherData from "../models/WeatherData";

interface CsvRow {
    record_time: string;
    air_pres: string;
    air_temp: string;
    water_temp: string;
    wind_dir: string;
    wind_speed: string;
}

interface WeatherDataEntry {
    record_time: Date | null;
    air_pres: number | null; // Allow null for invalid numbers
    air_temp: number | null;
    water_temp: number | null;
    wind_dir: number | null;
    wind_speed: number | null;
}

const processCSV = async (filePath: string) => {
    console.log("Checking if data already exists...");

    const existingDataCount = await WeatherData.countDocuments();

    if (existingDataCount > 0) {
        console.log("Data already exists in the database. Skipping CSV import.");
        return;
    }

    console.log("No existing data found. Proceeding with CSV import.");

    console.log("Processing CSV file...");
    let results: WeatherDataEntry[] = [];
    const stream = fs.createReadStream(filePath).pipe(csv());

    try { 
        for await (const row of stream) {
            const csvRow = row as CsvRow;

            const parsedRow: WeatherDataEntry = {
                record_time: parseDate(csvRow.record_time),
                air_pres: parseNumber(csvRow.air_pres),
                air_temp: parseNumber(csvRow.air_temp),
                water_temp: parseNumber(csvRow.water_temp),
                wind_dir: parseNumber(csvRow.wind_dir),
                wind_speed: parseNumber(csvRow.wind_speed),
            };

            // if (Object.values(parsedRow).some(val => val === null)) {
            //     console.error(`Invalid data in row: ${JSON.stringify(row)}. Skipping row.`);
            //     continue;
            // }

            results.push(parsedRow);

            if (results.length >= 300) {
                try {
                    await WeatherData.insertMany(results);
                    results = []; // Reset the array
                } catch (error) {
                    console.error("Error inserting data:", error);
                    return; // Stop processing if a database error occurs
                }
            }
        }

        if (results.length > 0) {
            try {
                await WeatherData.insertMany(results);
            } catch (error) {
                console.error("Error inserting final batch of data:", error);
                return; // Stop processing if a database error occurs
            }
        }

        console.log("CSV data inserted into MongoDB.");

    } catch (fileError) {
        console.error("Error reading or processing the CSV file:", fileError);
    }
};

function parseDate(dateString: string): Date | null {
    try {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return null;
    }
}

function parseNumber(numString: string): number | null {
    const num = parseFloat(numString);
    return isNaN(num) ? null : num;
}

export default processCSV;