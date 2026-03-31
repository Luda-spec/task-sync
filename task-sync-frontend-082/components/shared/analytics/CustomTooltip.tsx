import { TooltipProps } from "recharts";

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    payload: {
      label: string;
      value: number;
    };
  }>;
}

export const CustomTooltip = ({
  active,
  payload,
}: CustomTooltipProps) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-secondary">
        <p className="text-xs sm:text-sm font-medium text-primary">
          {payload[0].value} задач
        </p>
      </div>
    );
  }

  return null;
};