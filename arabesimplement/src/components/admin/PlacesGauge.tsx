interface PlacesGaugeProps {
  current: number;
  max: number;
  showLabel?: boolean;
}

export function PlacesGauge({ current, max, showLabel = true }: PlacesGaugeProps) {
  const percentage =
    max <= 0 ? 0 : Math.min((current / max) * 100, 100);
  
  const getColor = () => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-orange-500";
    return "bg-accent";
  };

  return (
    <div className="w-full">
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-500 mt-1">
          {current}/{max} places
        </p>
      )}
    </div>
  );
}
