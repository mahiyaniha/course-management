import React from "react";

const gradeLabelMap = {
  Aplus: "A+",
  A: "A",
  Aminus: "A-",
  Bplus: "B+",
  B: "B",
  C: "C",
  D: "D",
  F: "F",
};

const GradeDistributionChart = ({ distribution }) => {
  const safeDistribution =
    distribution && typeof distribution === "object" ? distribution : {};

  const chartData = Object.entries(gradeLabelMap).map(([key, label]) => ({
    key,
    label,
    value: Number(safeDistribution[key]) || 0,
  }));

  const highestValue = Math.max(...chartData.map((item) => item.value), 0);

  if (highestValue === 0) {
    return (
      <div className="dashboard-empty-state">
        No grade distribution data available yet.
      </div>
    );
  }

  return (
    <div className="grade-chart">
      {chartData.map((item) => {
        const height = highestValue ? (item.value / highestValue) * 100 : 0;

        return (
          <div key={item.key} className="grade-chart__item">
            <span className="grade-chart__value">{item.value}</span>
            <div className="grade-chart__bar-track">
              <div
                className="grade-chart__bar-fill"
                style={{ height: `${Math.max(height, item.value ? 14 : 0)}%` }}
              />
            </div>
            <span className="grade-chart__label">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default GradeDistributionChart;
