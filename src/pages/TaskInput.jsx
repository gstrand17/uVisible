import React, { useState } from "react";
import ReactDOM from "react-dom";
// import "../App.css";
import "./Taskboard.css";

function TaskInput({ onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    labor: "low",
    time_day: "morning",
    freq: "daily",
    spec_date: "",
    adult_only: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = () => {
    console.log(formData);
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Add Task</h2>

        <label>
          Task Name
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </label>

        <label>
          Duration (minutes)
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
          />
        </label>

        <label>
          Labor Level
          <select
            name="labor"
            value={formData.labor}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="extreme">Extreme</option>
          </select>
        </label>

        <label>
          Time of Day
          <select
            name="time_day"
            value={formData.time_day}
            onChange={handleChange}
          >
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="night">Night</option>
          </select>
        </label>

        <label>
          Frequency
          <select
            name="freq"
            value={formData.freq}
            onChange={handleChange}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="date-specific">Date Specific</option>
          </select>
        </label>

        {formData.freq === "date-specific" && (
          <label>
            Specific Date
            <input
              type="date"
              name="spec_date"
              value={formData.spec_date}
              onChange={handleChange}
            />
          </label>
        )}

        <label style={{ flexDirection: "row", gap: "0.5rem", alignItems: "center" }}>
          <input
            type="checkbox"
            name="adult_only"
            checked={formData.adult_only}
            onChange={handleChange}
          />
          Kid Friendly
        </label>

        <div className="modal-buttons">
          <button className="cancelButton" onClick={onClose}>
            Cancel
          </button>

          <button
            className="addTaskButton"
            onClick={handleSubmit}
            disabled={!formData.title || !formData.duration}
          >
            Add Task
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default TaskInput;