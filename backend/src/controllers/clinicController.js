const Clinic = require("../models/Clinic");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

exports.getDashboard = async (req, res) => {
  try {
    const clinicId = req.user.id;

    // Fetch all appointments for this clinic
    const allAppointments = await Appointment.find({ clinicId })
      .populate("userId", "name")
      .lean();

    // Today's date (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

    // Filter today's booked appointments
    const todaysAppointments = allAppointments.filter(
      (a) => a.date === today && a.status === "booked"
    );

    // Stats
    const stats = {
      totalAppointments: allAppointments.length,
      upcomingAppointments: allAppointments.filter(
        (a) => a.status === "booked" && new Date(a.date) >= new Date()
      ).length,
      todaysAppointmentCount: todaysAppointments.length,
    };

    // ---- Rolling Last 7 Days ----
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 6); // last 7 days including today
    startDate.setHours(0, 0, 0, 0);

    // Prepare last 7 days array
    const weeklyAppointments = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startDate.getTime());
      d.setDate(startDate.getDate() + i);

      const keyDate = new Date(d);
      keyDate.setDate(keyDate.getDate() + 1); // 👈 add 1 day

      return {
        key: keyDate.toISOString().split("T")[0],
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count: 0,
      };
    });

    // Count appointments for last 7 days
    allAppointments.forEach((app) => {
      if (app.date) {
        const appDate = new Date(app.date);
        if (!isNaN(appDate) && appDate >= startDate && appDate <= now) {
          const appDay = appDate.toISOString().split("T")[0];
          const target = weeklyAppointments.find((d) => d.key === appDay); // compare with key
          if (target) target.count++;
        }
      }
    });

    // Add userName for today's appointments
    todaysAppointments.forEach((a) => {
      if (a.userId) {
        a.userName = a.userId.name;
        delete a.userId;
      }
    });

    // Send response
    res.json({ stats, todaysAppointments, weeklyAppointments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
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
      { _id: id },
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
