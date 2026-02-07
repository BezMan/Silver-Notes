import { useState, useEffect, useCallback } from 'react';
import { getNotes } from '../api/notesApi';

export const useNotesManager = (searchQuery, showArchived) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotes = useCallback(async () => {
        setLoading(true);
        try {
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
    }, [searchQuery, showArchived]);

    // Debounce search effect
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchNotes();
        }, 300);
        return () => clearTimeout(handler);
    }, [fetchNotes]);

    // Optimistic CRUD handlers
    const addNote = (newNote) => {
        setNotes((prev) => [newNote, ...prev]);
    };

    const updateNote = (id, updatedNote) => {
        if (!updatedNote) { // Optimistic delete signal
            setNotes((prev) => prev.filter(n => n._id !== id));
            return;
        }
        setNotes((prev) => prev.map(n => n._id === id ? updatedNote : n));
    };

    const deleteNote = (id) => {
        setNotes((prev) => prev.filter(n => n._id !== id));
    };

    return {
        notes,
        loading,
        addNote,
        updateNote,
        deleteNote,
        refreshNotes: fetchNotes
    };
};
