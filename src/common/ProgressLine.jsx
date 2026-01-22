export const ProgressBar = ({
  value,
  max,
  threshold,
  height = "h-1",
  fillColor = "bg-[#0060A9]",
  gradient,
}) => {
  const percentage = (value / max) * 100;
  const isAboveThreshold = value > threshold;

  return (
    <div
      className={`w-full ${height} bg-gray-300 rounded-full overflow-hidden`}
    >
      <div
        className={`h-full  transition-all duration-700 ease-in-out ${
          isAboveThreshold ? "bg-red-600" : "bg-[#0060A9]"
        }`}
        style={{
          width: `${percentage}%`,
          background: gradient
            ? gradient // use gradient if provided
            : isAboveThreshold
            ? "red"
            : undefined,
        }}
      ></div>
    </div>
  );
};
