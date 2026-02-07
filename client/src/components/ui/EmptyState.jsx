import React from 'react';

const EmptyState = ({ showArchived }) => {
    return (
        <div className="text-center mt-20 text-gray-500 flex flex-col items-center">
            <div className="text-6xl mb-4">🍃</div>
            <p className="text-lg">{showArchived ? 'No archived notes' : 'Notes you add appear here'}</p>
        </div>
    );
};

export default EmptyState;
