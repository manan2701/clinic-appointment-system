const mongoose = require("mongoose");
const clinicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "Clinic" },
    licenseNumber: { type: String, required: true },
    isApproved: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    address: { street: String, city: String, zip: String },
    doctorDetails: [{ name: String, specialization: String }],
    charges: { type: Number, default: 0 },
    availability: { type: Map, of: [String] },
    photo: {
      type: String,
      default: "https://placehold.co/600x400/A8D5BA/FFFFFF?text=Clinic",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Clinic", clinicSchema);
