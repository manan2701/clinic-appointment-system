import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../common/Spinner";
import ImageUpload from "../common/ImageUpload";
import "../../css/Forms.css";
import "../../css/Button.css";

const empty = {
  name: "",
  specialization: "",
  bio: "",
  photo: "",
  availability: {},
};

const DoctorsManager = () => {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/clinic/doctors");
      setDoctors(res.data);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`/api/clinic/doctors/${editingId}`, form);
    } else {
      const formd = new FormData();
      formd.append("name", form.name);
      formd.append("specialization", form.specialization);
      formd.append("bio", form.bio);
      formd.append("availability", JSON.stringify(form.availability || {}));
      if (form.photo instanceof File) {
        formd.append("image", form.photo);
      }

      await axios.post("/api/clinic/doctors", formd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    setForm(empty);
    setEditingId(null);
    load();
  };

  const remove = async (id) => {
    await axios.delete(`/api/clinic/doctors/${id}`);
    load();
  };
  const edit = (doc) => {
    setForm({ ...doc });
    setEditingId(doc._id);
  };

  if (loading) return <Spinner />;

  const handleImageUpload = async (file) => {
    const formd = new FormData();
    formd.append("image", file);
    formd.append("id", form._id || editingId);

    try {
      const res = await axios.post("/api/clinic/doctors/image", formd);
      if (res.data?.image) {
        setForm((prev) => ({ ...prev, photo: res.data.image }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h3>Manage Doctors</h3>
      <ImageUpload
        image={
          form.photo instanceof File
            ? URL.createObjectURL(form.photo) // 👈 show preview immediately
            : form.photo ||
              "https://placehold.co/600x400/A8D5BA/FFFFFF?text=Doctor"
        }
        label="Doctor Image"
        onChange={(file) => setForm({ ...form, photo: file })}
      />
      <form onSubmit={submit} className="profile-form">
        <div className="form-group">
          <label>Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Specialization</label>
          <input
            value={form.specialization}
            onChange={(e) =>
              setForm({ ...form, specialization: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </div>
        <button className="btn btn-primary" type="submit">
          {editingId ? "Update" : "Add"} Doctor
        </button>
        {editingId && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              setForm(empty);
              setEditingId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>
      <table className="data-table" style={{ marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialization</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((d) => (
            <tr key={d._id}>
              <td>{d.name}</td>
              <td>{d.specialization}</td>
              <td className="table-actions">
                <button className="btn btn-secondary" onClick={() => edit(d)}>
                  Edit
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => remove(d._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorsManager;
