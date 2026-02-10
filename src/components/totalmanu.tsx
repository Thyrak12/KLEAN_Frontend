import React from 'react';

interface TotalMenuProps {
  label?: string;
  count: number;
}

const TotalMenu: React.FC<TotalMenuProps> = ({ label = "Total Menu", count }) => {
  return (
    <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-sm w-full">
      {/* Label Text */}
      <h3 className="text-lg font-bold text-gray-900 tracking-tight">
        {label}
      </h3>
      
      {/* Count Badge */}
      <div className="flex items-center justify-center bg-amber-400 text-black text-4xl font-bold py-3 px-10 rounded-2xl shadow-sm w-full max-w-[200px]">
        {count}
      </div>
    </div>
  );
};

export default TotalMenu;