import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sticky Note Background */}
      <rect
        x="10"
        y="10"
        width="80"
        height="80"
        rx="8"
        className="fill-yellow-300 dark:fill-yellow-600 stroke-yellow-500 dark:stroke-yellow-700 stroke-2"
      />
      {/* Folded Corner */}
      <path
        d="M 65 90 L 90 90 L 90 65"
        className="fill-yellow-400 dark:fill-yellow-700"
      />
      
      {/* Brain Icon / Circuitry overlay */}
      <path
        d="M 30 50 C 30 35 40 30 50 30 C 60 30 70 35 70 50 C 70 60 60 70 50 70 C 40 70 30 60 30 50 Z"
        className="stroke-gray-800 dark:stroke-white stroke-[3]"
      />
      <path
        d="M 50 30 L 50 20"
        className="stroke-gray-800 dark:stroke-white stroke-[3]"
      />
      <path
        d="M 35 38 L 28 32"
        className="stroke-gray-800 dark:stroke-white stroke-[3]"
      />
      <path
        d="M 65 38 L 72 32"
        className="stroke-gray-800 dark:stroke-white stroke-[3]"
      />
      
      {/* Synapse dots */}
      <circle cx="50" cy="50" r="4" className="fill-blue-500" />
      <circle cx="40" cy="45" r="2" className="fill-gray-800 dark:fill-white" />
      <circle cx="60" cy="45" r="2" className="fill-gray-800 dark:fill-white" />
      <circle cx="50" cy="60" r="2" className="fill-gray-800 dark:fill-white" />
    </svg>
  );
};