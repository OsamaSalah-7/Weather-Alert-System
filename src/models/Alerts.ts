import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  record_time: { type: Date, required: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
});

const Alert = mongoose.model("Alert", alertSchema);
export default Alert;