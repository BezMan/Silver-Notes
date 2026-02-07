import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NoteCard from './NoteCard';

const NoteGrid = ({ notes, onUpdateNote, onDeleteNote }) => {
    return (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 p-4 mx-auto max-w-7xl">
            <AnimatePresence>
                {notes.map(note => (
                    <div key={note._id} className="break-inside-avoid mb-4">
                        <NoteCard
                            note={note}
                            onUpdate={(updated) => onUpdateNote(note._id, updated)}
                            onDelete={() => onDeleteNote(note._id)}
                        />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default NoteGrid;
