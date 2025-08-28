const Clinic = require("../models/Clinic");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

exports.getDashboard = async (req, res) => {
  const clinicId = req.user.id;
  const allAppointments = await Appointment.find({ clinicId })
    .populate("userId", "name")
    .lean();
  const today = new Date().toISOString().split("T")[0];
  const todaysAppointments = allAppointments.filter(
    (a) => a.date === today && a.status === "booked"
  );
  const stats = {
    totalAppointments: allAppointments.length,
    upcomingAppointments: allAppointments.filter(
      (a) => a.status === "booked" && new Date(a.date) >= new Date()
    ).length,
    todaysAppointmentCount: todaysAppointments.length,
  };
  const weeklyAppointments = Array(7)
    .fill(0)
    .map((_, i) => ({
      name: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i],
      count: 0,
    }));
  allAppointments.forEach((app) => {
    if (app.date && !isNaN(new Date(app.date))) {
      const dayOfWeek = new Date(app.date).getDay();
      weeklyAppointments[dayOfWeek].count++;
    }
  });
  todaysAppointments.forEach((a) => {
    if (a.userId) {
      a.userName = a.userId.name;
      delete a.userId;
    }
  });
  res.json({ stats, todaysAppointments, weeklyAppointments });
};

exports.getAppointments = async (req, res) => {
  const appointments = await Appointment.find({ clinicId: req.user.id })
    .populate("userId", "name photo")
    .lean();
  appointments.forEach((a) => {
    if (a.userId) {
      a.userName = a.userId.name;
      a.userPhoto = a.userId.photo;
      delete a.userId;
    }
  });
  res.json(appointments);
};

exports.updateAppointmentStatus = async (req, res) => {
  const appointment = await Appointment.findOneAndUpdate(
    { _id: req.params.id, clinicId: req.user.id },
    { status: req.body.status },
    { new: true }
  );
  if (!appointment)
    return res.status(404).json({ message: "Appointment not found" });
  res.json({ message: "Appointment status updated" });
};

exports.updateProfile = async (req, res) => {
  const {
    _id,
    name,
    email,
    licenseNumber,
    isApproved,
    role,
    ...updatableData
  } = req.body;
  const clinic = await Clinic.findByIdAndUpdate(req.user.id, updatableData, {
    new: true,
  });
  res.json({ message: "Profile updated successfully", clinic });
};

exports.updateClinicImage = async (req, res) => {
  try {
    const licenseNumber = req.body.licenseNumber;
    const imageName = req.file.filename;
    const updated = await Clinic.findOneAndUpdate(
      { licenseNumber },
      { photo: `/assets/${imageName}` },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Clinic not found" });
    res.json({
      message: "Clinic image updated",
      image: `/assets/${imageName}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Clinic image upload failed", error });
  }
};

exports.updateDoctorImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    const id = req.body.id;
    const imageName = req.file.filename;
    const updated = await Doctor.findOneAndUpdate(
      { _id : id },
      { photo: `/assets/${imageName}` },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Doctor not found" });
    res.json({
      message: "Clinic image updated",
      image: `/assets/${imageName}`,
    });
  } catch (error) {
    res.status(500).json({ message: "doctor image upload failed", error });
  }
};
