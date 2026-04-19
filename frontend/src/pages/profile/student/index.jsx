import { useEffect, useState, useCallback } from "react";
import useUserDetails from "../../../hooks/useUserDetails";
import "./StudentProfile.css";

const StudentProfile = () => {
  const { setUserDetails } = useUserDetails();

  const [form, setForm] = useState({
    id: 1,
    email: "",
    firstName: "",
    lastName: "",
    description: "",
    address: "",
    phone: "",
    department: ""
  });

  const [photo, setPhoto] = useState(null);
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const getImageUrl = (base64) => {
    if (!base64) return null;
    return `data:image/jpeg;base64,${base64}`;
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append(
      "data",
      new Blob([JSON.stringify(form)], { type: "application/json" })
    );

    if (file) formData.append("photo", file);

    try {
      const res = await fetch(
        "http://localhost:8080/api/student/update-profile",
        { method: "POST", body: formData }
      );

      const data = await res.text();
      if (data) fetchStudent();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudent = useCallback(async () => {
    try {
      const userId = localStorage.getItem("userId");

      const resp = await fetch(
        "http://localhost:8080/api/student/" + userId
      );

      const data = await resp.json();

      if (data) {
        setForm({
          id: data?.id || 1,
          email: data?.user?.email,
          firstName: data?.user?.firstName,
          lastName: data?.user?.lastName,
          description: data?.description,
          address: data?.address,
          phone: data?.phone,
          department: data?.department?.name
        });

        const name =
          data?.user?.firstName + " " + data?.user?.lastName;

        setUserDetails((prev) => ({
          ...prev,
          picture: data?.picture,
          name: name
        }));

        localStorage.setItem("picture", data?.picture);
        localStorage.setItem("name", name);

        setPhoto(data.picture || null);
      }
    } catch (e) {
      console.error(e.message);
    }
  }, [setUserDetails]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  return (
    <div className="profile-page">

      {/* LEFT */}
      <div className="profile-left">

        <div className="avatar-wrapper">
          <img
            src={
              photo
                ? getImageUrl(photo)
                : "https://ui-avatars.com/api/?name=Student"
            }
            alt="profile"
            className="profile-avatar"
          />
        </div>

        <div className="upload-box">
          <input type="file" onChange={handleFileChange} />
        </div>

        <div className="profile-identity">
          <h2>{form.firstName} {form.lastName}</h2>
          <p>{form.email}</p>
          <span>{form.department}</span>
        </div>

      </div>

      {/* RIGHT */}
      <div className="profile-right">

        <div className="form-grid">

          <div className="field">
            <label>First Name</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} />
          </div>

          <div className="field">
            <label>Last Name</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} />
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

export default StudentProfile;