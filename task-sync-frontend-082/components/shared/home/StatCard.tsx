'use client';

export const StatCard = ({
  title,
  value,
  primary,
}: {
  title: string;
  value: number;
  primary?: boolean;
}) => {
  return (
    <div
      className={`rounded-xl p-4 sm:p-5 lg:p-6 shadow ${
        primary
          ? 'bg-primary text-primary-foreground'
          : 'bg-primary-foreground text-foreground'
      }`}
    >
      <p className="text-sm sm:text-base mb-3">{title}</p>

      <h2 className="text-3xl sm:text-4xl font-semibold">{value}</h2>
    </div>
  );
};