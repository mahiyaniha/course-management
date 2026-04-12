import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const StatCard = ({ title, value, subtitle, icon, tone = "slate" }) => {
  const safeTitle = typeof title === "string" && title.trim() ? title : "Overview";
  const safeSubtitle =
    typeof subtitle === "string" && subtitle.trim() ? subtitle : "No details available";
  const safeTone = typeof tone === "string" && tone.trim() ? tone : "slate";
  const safeValue =
    value === null || value === undefined || value === "" ? "0" : String(value);

  return (
    <article className={`stat-card stat-card--${safeTone}`}>
      <div className="stat-card__icon">
        <FontAwesomeIcon icon={icon || faCircleInfo} />
      </div>

      <div className="stat-card__content">
        <span>{safeTitle}</span>
        <strong>{safeValue}</strong>
        <p>{safeSubtitle}</p>
      </div>
    </article>
  );
};

export default StatCard;
