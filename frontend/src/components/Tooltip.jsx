import React from 'react';

const Tooltip = ({ text }) => {
  return (
    <div className="absolute left-12 top-1/2 transform -translate-y-1/2 p-2 px-3 bg-gray-700 text-white text-sm rounded-md shadow-lg">
      {text}
    </div>
  );
};

export default Tooltip;
