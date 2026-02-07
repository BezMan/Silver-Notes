import React from 'react';
import { Search } from 'lucide-react';

const Header = ({ searchQuery, setSearchQuery, showArchived, setShowArchived }) => {
    return (
        <header className="header-container">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Logo Area */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-yellow-400 rounded-md flex items-center justify-center font-bold text-black border border-yellow-500">
                        S
                    </div>
                    <h1 className="text-xl font-semibold hidden sm:block">Silver Notes</h1>
                </div>

                {/* Search Bar */}
                <div className="flex-1 max-w-2xl relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search"
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowArchived(!showArchived)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${showArchived ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-100'}`}
                    >
                        {showArchived ? 'Archives' : 'Notes'}
                    </button>
                    {/* Future: User Avatar */}
                </div>
            </div>
        </header>
    );
};

export default Header;
