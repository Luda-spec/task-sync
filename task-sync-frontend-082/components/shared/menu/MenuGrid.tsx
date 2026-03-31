'use client';

import { MenuItem } from "./MenuItem";


type Item = {
  label: string;
  icon: string;
  href: string;
};

export const MenuGrid = ({ items }: { items: Item[] }) => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-xs md:max-w-sm">
      {items.map((item) => (
        <MenuItem key={item.label} {...item} />
      ))}
    </div>
  );
};