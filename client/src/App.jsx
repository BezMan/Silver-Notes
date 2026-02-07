import React, { useState } from 'react';
import NoteGrid from './features/notes/components/NoteGrid';
import NoteEditor from './features/notes/components/NoteEditor';
import Header from './components/layout/Header';
import LoadingState from './components/ui/LoadingState';
import EmptyState from './components/ui/EmptyState';
import { useNotesManager } from './features/notes/hooks/useNotesManager';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  // Custom hook manages all note logic (Data Layer)
  const { notes, loading, addNote, updateNote, deleteNote } = useNotesManager(searchQuery, showArchived);

  return (
    <div className="app-container">
      {/* Organized Header Component */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showArchived={showArchived}
        setShowArchived={setShowArchived}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {!showArchived && <NoteEditor onNoteCreated={addNote} />}

        {loading && notes.length === 0 ? (
          <LoadingState />
        ) : (
          <>
            {notes.length === 0 && !loading && (
              <EmptyState showArchived={showArchived} />
            )}
            <NoteGrid notes={notes} onUpdateNote={updateNote} onDeleteNote={deleteNote} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
