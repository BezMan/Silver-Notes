import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { getNotes } from './features/notes/api/notesApi';
import NoteGrid from './features/notes/components/NoteGrid';
import NoteEditor from './features/notes/components/NoteEditor';

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLabel, setFilterLabel] = useState(''); // Future proofing
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [searchQuery, showArchived]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      // Debounce could be added here or in the input handler
      const params = {
        search: searchQuery,
        isArchived: showArchived
      };
      const data = await getNotes(params);
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchNotes();
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);


  const handleNoteCreated = (newNote) => {
    setNotes([newNote, ...notes]);
  };

  const handleUpdateNote = (id, updatedNote) => {
    if (!updatedNote) { // Optimistic delete
      setNotes(notes.filter(n => n._id !== id));
      return;
    }
    // Optimistic update
    setNotes(notes.map(n => n._id === id ? updatedNote : n));
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(n => n._id !== id));
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-md flex items-center justify-center font-bold text-black border border-yellow-500">
              S
            </div>
            <h1 className="text-xl font-semibold hidden sm:block">Silver Notes</h1>
          </div>

          <div className="flex-1 max-w-2xl relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-lg leading-5 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:ring-0 focus:shadow-md transition-all sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!showArchived && <NoteEditor onNoteCreated={handleNoteCreated} />}

        {loading && notes.length === 0 ? (
          <div className="flex justify-center mt-10">
            <Loader2 className="animate-spin text-gray-400" size={32} />
          </div>
        ) : (
          <>
            {notes.length === 0 && !loading && (
              <div className="text-center mt-20 text-gray-500 flex flex-col items-center">
                <div className="text-6xl mb-4">🍃</div>
                <p className="text-lg">{showArchived ? 'No archived notes' : 'Notes you add appear here'}</p>
              </div>
            )}
            <NoteGrid notes={notes} onUpdateNote={handleUpdateNote} onDeleteNote={handleDeleteNote} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
