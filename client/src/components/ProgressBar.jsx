import React from 'react'

const ProgressBar = ({ completed }) => {
  return (
    <div className="w-3/4 bg-gray-200 rounded-full h-5 dark:bg-gray-700 relative">
      <div
        className="bg-blue-600 h-full rounded-full transition-[width] duration-150"
        style={{ width: `${completed}%` }}
      >
        <p className="text-white text-center absolute left-1/2">
          {Math.floor(completed)}%
        </p>
      </div>
    </div>
  )
}

export default ProgressBar
