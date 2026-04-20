import React, { useEffect, useMemo, useState } from "react";
import {
  FaClock,
  FaBook,
  FaInfoCircle,
  FaCalendarAlt,
  FaUsers,
} from "react-icons/fa";

import "./Schedule.css";

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const dummy = [
  {
    id: 1,
    day: "Monday",
    startTime: "09:00 AM",
    endTime: "10:30 AM",
    course: { title: "Data Structures", code: "CSE201", credit: 3 },
    seatLimit: 30,
    seatTaken: 28,
  },
  {
    id: 2,
    day: "Monday",
    startTime: "02:00 PM",
    endTime: "03:30 PM",
    course: { title: "Software Engineering", code: "CSE401", credit: 3 },
    seatLimit: 25,
    seatTaken: 24,
  },
  {
    id: 3,
    day: "Tuesday",
    startTime: "11:00 AM",
    endTime: "12:30 PM",
    course: { title: "Database Systems", code: "CSE301", credit: 3 },
    seatLimit: 35,
    seatTaken: 32,
  },
  {
    id: 4,
    day: "Tuesday",
    startTime: "03:00 PM",
    endTime: "04:30 PM",
    course: { title: "Computer Networks", code: "CSE303", credit: 3 },
    seatLimit: 40,
    seatTaken: 36,
  },
  {
    id: 5,
    day: "Wednesday",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    course: { title: "Algorithms", code: "CSE202", credit: 4 },
    seatLimit: 30,
    seatTaken: 29,
  },
  {
    id: 6,
    day: "Thursday",
    startTime: "09:00 AM",
    endTime: "10:30 AM",
    course: { title: "Operating Systems", code: "CSE302", credit: 3 },
    seatLimit: 28,
    seatTaken: 27,
  },
  {
    id: 7,
    day: "Thursday",
    startTime: "01:00 PM",
    endTime: "02:30 PM",
    course: { title: "Web Development", code: "CSE405", credit: 3 },
    seatLimit: 45,
    seatTaken: 41,
  },
  {
    id: 8,
    day: "Friday",
    startTime: "11:00 AM",
    endTime: "12:30 PM",
    course: { title: "Machine Learning", code: "CSE450", credit: 3 },
    seatLimit: 25,
    seatTaken: 23,
  },
];

const Schedule = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const load = async () => {
      const userId = localStorage.getItem("userId");

      try {
        const res = await fetch(
          `http://localhost:8080/api/student/schedule/${userId}`
        );
        const json = await res.json();

        if (Array.isArray(json) && json.length > 0) {
          setData(json);
          setSelected(json[0]);
        }
      } catch {
        setData(dummy);
        setSelected(dummy[0]);
      }
    };

    load();
  }, []);

  const getTimeValue = (t) => {
    if (!t) return 0;
    const [time, mod] = t.split(" ");
    let [h, m] = time.split(":").map(Number);
    if (mod === "PM" && h !== 12) h += 12;
    if (mod === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };

  const events = useMemo(() => {
    return data.map((e, i) => {
      const start = getTimeValue(e.startTime);
      const end = getTimeValue(e.endTime);

      return {
        ...e,
        key: i,
        top: ((start - 480) / 600) * 100,
        height: Math.max(((end - start) / 600) * 100, 10),
      };
    });
  }, [data]);

  return (
    <div className="schPage">
      {/* HEADER */}
      <div className="schHeader">
        <FaCalendarAlt />
        <div>
          <h2>Weekly Schedule</h2>
          <p>Smart Course Planner</p>
        </div>
      </div>

      <div className="schLayout">
        {/* TIMELINE */}
        <div className="timeline">
          {DAYS.map((day) => (
            <div className="dayColumn" key={day}>
              <div className="dayTitle">{day}</div>

              {events
                .filter((e) => e.day.toUpperCase() === day)
                .map((e) => (
                  <div
                    key={e.key}
                    className={`eventCard ${selected?.key === e.key ? "active" : ""
                      }`}
                    onClick={() => setSelected(e)}
                    style={{
                      top: `${e.top}%`,
                      height: `${e.height}%`,
                    }}
                  >
                    <div className="accentBar" />
                    <div>
                      <h4>{e.course.title}</h4>
                      <span>
                        {e.startTime} - {e.endTime}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* RIGHT PANEL */}
        <div className="sidePanel">
          <div className="glassCard">
            <h3>Class Details</h3>

            <div className="infoRow">
              <FaBook />
              {selected?.course?.title || "No course selected"}
            </div>

            <div className="infoRow">
              <FaCalendarAlt />
              {selected?.day || "No day"}
            </div>

            <div className="infoRow">
              <FaClock />
              {selected?.startTime} - {selected?.endTime}
            </div>

            <div className="infoRow">
              <FaInfoCircle />
              {selected?.course?.code || "N/A"}
            </div>

            <div className="infoRow">
              <span>📚</span>
              {selected?.course?.credit || "N/A"} Credits
            </div>

            <div className="infoRow">
              <FaUsers />
              {selected?.seatTaken || 0}/
              {selected?.seatLimit || "N/A"} seats
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;