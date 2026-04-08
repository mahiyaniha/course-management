import React, { useState } from "react";
import "./Schedule.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCalendarCheck, 
  faChevronDown, 
  faChevronUp 
} from "@fortawesome/free-solid-svg-icons";

const Schedule = () => {
  const [showSchedule, setShowSchedule] = useState(false);

  // Dummy data (UI only)
  const schedule = [
    {
      id: 1,
      course: "Data Structures",
      day: "Mon",
      time: "09:00 - 10:30",
      instructor: "Prof. C",
    },
    {
      id: 2,
      course: "Algorithms",
      day: "Tue",
      time: "11:00 - 12:30",
      instructor: "Prof. E",
    },
    {
      id: 3,
      course: "Databases",
      day: "Wed",
      time: "13:00 - 14:30",
      instructor: "Prof. K",
    },
    {
      id: 4,
      course: "Operating Systems",
      day: "Thu",
      time: "09:00 - 10:30",
      instructor: "Prof. L",
    },
  ];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const times = [
    "09:00 - 10:30",
    "11:00 - 12:30",
    "13:00 - 14:30",
    "15:00 - 16:30",
  ];

  const getCourse = (day, time) => {
    return schedule.find(
      (c) => c.day === day && c.time === time
    );
  };

  const toggleSchedule = () => {
    setShowSchedule(!showSchedule);
  };

  return (
    <div className="schedule-container">
      {/* 🔘 Compact Toggle Button */}
      <button 
        className="schedule-toggle-btn"
        onClick={toggleSchedule}
      >
        <FontAwesomeIcon 
          icon={faCalendarCheck} 
          className="header-icon" 
        />
        <div className="btn-content">
          <div className="header-title">My Schedule</div>
          <div className="subtitle">Click to see your schedule for this week</div>
        </div>
        <FontAwesomeIcon 
          icon={showSchedule ? faChevronUp : faChevronDown} 
          className="toggle-icon" 
        />
      </button>

      {/* 📅 Timetable - Conditional */}
      {showSchedule && (
        <div className="timetable">
          {/* Header Row */}
          <div className="row header-row">
            <div className="cell time-cell">Time</div>
            {days.map((day) => (
              <div key={day} className="cell">
                {day}
              </div>
            ))}
          </div>

          {/* Time Rows */}
          {times.map((time) => (
            <div className="row" key={time}>
              <div className="cell time-cell">{time}</div>

              {days.map((day) => {
                const course = getCourse(day, time);

                return (
                  <div className="cell" key={day}>
                    {course ? (
                      <div className="course-box">
                        <div className="course-title">
                          {course.course}
                        </div>
                        <div className="course-instructor">
                          {course.instructor}
                        </div>
                      </div>
                    ) : (
                      <span className="empty">—</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Schedule;
