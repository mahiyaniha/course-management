import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const InsightPanel = ({ title, icon, badge, children }) => {
  const safeTitle = typeof title === "string" && title.trim() ? title : "Overview";
  const safeBadge = typeof badge === "string" && badge.trim() ? badge : "";

  return (
    <section className="insight-panel">
      <div className="insight-panel__header">
        <div className="insight-panel__title">
          <FontAwesomeIcon icon={icon || faCircleInfo} />
          <h2>{safeTitle}</h2>
        </div>
        {safeBadge ? <span className="insight-panel__badge">{safeBadge}</span> : null}
      </div>

      <div className="insight-panel__body">{children ?? null}</div>
    </section>
  );
};

export default InsightPanel;
