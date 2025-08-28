import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import Spinner from "../common/Spinner";
import ImageUpload from "../common/ImageUpload";
import "../../css/Forms.css";
import "../../css/Button.css";

const ClinicProfile = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`/api/clinics/${user.id}`);
      setFormData(res.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    try {
      await axios.put("/api/clinic/profile", formData);
      setSuccess("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  const handleImageUpload = async (type, file) => {
    const form = new FormData();
    form.append("image", file);
    form.append("licenseNumber", formData.licenseNumber);

    try {
      await axios.put("/api/clinic/image", form);
      await fetchProfile();
      setSuccess("Image updated successfully!");
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h3>Edit Your Clinic Profile</h3>
      <ImageUpload
        image={formData.photo}
        label="Clinic Image"
        onChange={(file) => handleImageUpload("clinic", file)}
      />
      <form onSubmit={handleSubmit} className="profile-form">
        {success && <p className="success-message">{success}</p>}
        <div className="form-group">
          <label>Clinic Name</label>
          <input type="text" value={formData.name || ""} disabled />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={formData.email || ""} disabled />
        </div>
        <div className="form-group">
          <label>Street Address</label>
          <input
            type="text"
            name="address.street"
            value={formData.address?.street || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            name="address.city"
            value={formData.address?.city || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Base Charge per Visit ($)</label>
          <input
            type="number"
            name="charges"
            value={formData.charges || ""}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ClinicProfile;
