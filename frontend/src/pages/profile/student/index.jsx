import { useEffect, useState } from "react";

const StudentProfile = () => {

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
        "http://localhost:8080/api/student/update-profile",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await res.text();
      if (data) {
      console.log(data);
        fetchStudent()
      }

    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- FETCH STUDENT ----------------
  const fetchStudent = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const resp = await fetch(
        "http://localhost:8080/api/student/" + userId
      );

      const data = await resp.json();

      if (data) {
        // ✅ ONLY TEXT FIELDS IN FORM
        setForm({
          id: data.id || 1,
          email: data.email || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          name: data.name || "",
          description: data.description || "",
          address: data.address || "",
          phone: data.phone || "",
          department: data.department || ""
        });

        // ✅ PHOTO STORED SEPARATELY
        setPhoto(data.picture || null);
      }

    } catch (e) {
      console.error(e.message);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  return (
    <div>
      <h2>Student Profile</h2>

      {/* ---------------- IMAGE DISPLAY ---------------- */}
      {photo && (
        <div>
          <img
            src={getImageUrl(photo)}
            alt="Student"
            width="120"
            height="120"
            style={{
              borderRadius: "50%",
              objectFit: "cover"
            }}
          />
        </div>
      )}

      {/* ---------------- FILE UPLOAD ---------------- */}
      <input type="file" onChange={handleFileChange} /><br />

      {/* ---------------- FORM FIELDS ---------------- */}
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" /><br />
      <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" /><br />
      <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" /><br />
      <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" /><br />
      <input name="description" value={form.description} onChange={handleChange} placeholder="Description" /><br />
      <input name="address" value={form.address} onChange={handleChange} placeholder="Address" /><br />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" /><br />
      <input name="department" value={form.department} onChange={handleChange} placeholder="Department" /><br />

      <button onClick={handleSubmit}>
        Update Profile
      </button>
    </div>
  );
};

export default StudentProfile;