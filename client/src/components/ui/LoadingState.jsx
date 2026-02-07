import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = () => {
    return (
        <div className="flex justify-center mt-10">
            <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
    );
};

export default LoadingState;
