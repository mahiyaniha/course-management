import { useEffect, useState, useCallback } from "react";
import useUserDetails from "../../../hooks/useUserDetails";
import "../student/StudentProfile.css";

const AdvisorProfile = () => {
  const { setUserDetails } = useUserDetails()

  const [form, setForm] = useState({
    id: 1,
    email: "",
    firstName: "",
    lastName: "",
    name: "",
    description: "",
    address: "",
    phone: "",
    department: ""
  });

  const [photo, setPhoto] = useState(null);   // ✅ ONLY for display
  const [file, setFile] = useState(null);

  // ---------------- HANDLE TEXT CHANGE ----------------
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ---------------- HANDLE FILE SELECT ----------------
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // ---------------- IMAGE CONVERTER ----------------
  const getImageUrl = (base64) => {
    if (!base64) return null;
    return `data:image/jpeg;base64,${base64}`;
  };

  // ---------------- UPDATE API ----------------
  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append(
      "data",
      new Blob([JSON.stringify(form)], { type: "application/json" })
    );

    if (file) {
      formData.append("photo", file);
    }

    try {
      const res = await fetch(
        "http://localhost:8080/api/admin/update-profile",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await res.text();
      if (data) {
      console.log(data);
        fetchAdmin()
      }

    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- FETCH STUDENT ----------------
  const fetchAdmin = useCallback(async () => {
    try {
      const userId = localStorage.getItem("userId");

      const resp = await fetch(
        "http://localhost:8080/api/admin/" + userId 
      );

      const data = await resp.json();

      if (data) {
        // ✅ ONLY TEXT FIELDS IN FORM
        setForm({
          id: data.id || 1,
          email: data?.user?.email || "",
          firstName: data?.user?.firstName || "",
          lastName: data?.user?.lastName || "",
          description: data.description || "",
          address: data.address || "",
          phone: data.phone || "",
        });

        setUserDetails(prev => ({
          ...prev,
          picture: data?.picture,
          name: data?.name
        }))
        localStorage.setItem("picture", data?.picture)
        localStorage.setItem("name", data?.name)

        // ✅ PHOTO STORED SEPARATELY
        setPhoto(data.picture || null);
      }

    } catch (e) {
      console.error(e.message);
    }
  }, [setUserDetails]);

  useEffect(() => {
    fetchAdmin();
  }, [fetchAdmin]);

  return (
    <div className="profile-page">
      <div className="profile-left">
        <div className="avatar-wrapper">
          <img
            src={getImageUrl(photo)}
            alt="Admin"
            className="profile-avatar"
          />
        </div>

        <div className="upload-box">
          <input type="file" onChange={handleFileChange} />
        </div>

        <div className="profile-identity">
          <h2>{form.firstName} {form.lastName}</h2>
          <p>{form.email}</p>
          <span>Administrator</span>
        </div>
      </div>

      <div className="profile-right">
        <div className="form-grid">
          <div className="field">
            <label>First Name</label>
            <input
              readOnly
              disabled
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Last Name</label>
            <input
              readOnly
              disabled
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} />
          </div>

          <div className="field">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} />
          </div>

          <div className="field full">
            <label>Address</label>
            <input name="address" value={form.address} onChange={handleChange} />
          </div>

          <div className="field full">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>
        </div>

        <button className="save-btn" onClick={handleSubmit}>
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default AdvisorProfile;
