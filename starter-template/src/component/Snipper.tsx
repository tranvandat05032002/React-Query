import React from 'react';

const Snipper = ({progress}: {progress: number}) => {
  return (
    <React.Fragment>
        <div className="fixed top-0 w-full h-1 mb-4 bg-gray-200 rounded-full dark:bg-gray-700">
          <div className="h-1 bg-blue-400 rounded-full dark:bg-blue-500" style={{ width: `${progress * 33.33}%` }} />
        </div>
    </React.Fragment>
  );
};

export default Snipper;