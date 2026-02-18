import React from 'react';

const Card = ({ children, className = "", title }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-100 p-5 ${className}`}>
      {title && (
        <h3 className="text-gray-800 font-semibold mb-4 text-sm uppercase tracking-wide">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;