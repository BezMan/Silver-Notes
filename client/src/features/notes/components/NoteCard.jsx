import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, Archive, Share2, Palette, MoreVertical, Link as LinkIcon, Lock } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { updateNote, patchNote, deleteNote } from '../api/notesApi';

const COLORS = [
    '#ffffff', // White
    '#f28b82', // Red
    '#fbbc04', // Orange
    '#fff475', // Yellow
    '#ccff90', // Green
    '#a7ffeb', // Teal
    '#cbf0f8', // Blue
    '#aecbfa', // Dark Blue
    '#d7aefb', // Purple
    '#fdcfe8', // Pink
    '#e6c9a8', // Brown
    '#e8eaed', // Grey
];

const NoteCard = ({ note, onUpdate, onDelete }) => {
    const [showColorPicker, setShowColorPicker] = useState(false);

    const handleCheckboxToggle = async (index) => {
        const newCheckList = [...note.checkList];
        newCheckList[index].isDone = !newCheckList[index].isDone;
        // Optimistic update
        onUpdate({ ...note, checkList: newCheckList });
        await patchNote(note._id, { checkList: newCheckList });
    };

    const handleColorChange = async (color) => {
        onUpdate({ ...note, bgColor: color });
        setShowColorPicker(false);
        await patchNote(note._id, { bgColor: color });
    };

    const handleArchive = async () => {
        onUpdate({ ...note, isArchived: !note.isArchived });
        await patchNote(note._id, { isArchived: !note.isArchived });
    };

    const handleDelete = async () => {
        onUpdate(null); // Optimistic remove
        await deleteNote(note._id);
    };

    const handleShare = () => {
        const text = `${note.title}\n\n${note.content || note.checkList.map(item => `${item.isDone ? '[x]' : '[ ]'} ${item.text}`).join('\n')}`;
        navigator.clipboard.writeText(text);
        alert('Note copied to clipboard'); // Simple feedback
    };

    // Helper to render content with smart links
    const renderContent = (content) => {
        if (!content) return null;
        // Simple regex for URLs
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = content.split(urlRegex);
        return parts.map((part, i) =>
            urlRegex.test(part) ? (
                <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1 display-inline" onClick={(e) => e.stopPropagation()}>
                    <LinkIcon size={12} /> {part}
                </a>
            ) : part
        );
    };

    const isDark = note.bgColor === '#ffffff' || note.bgColor === '#e8eaed'; // Simple check for text contrast if needed, mostly doing black text on colored bg

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={cn(
                "rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group relative border border-transparent",
                "flex flex-col gap-2"
            )}
            style={{
                backgroundColor: note.bgColor,
                color: '#202124' // Always dark text on these Keep-like colors
            }}
        >
            {/* Title */}
            {note.title && <h3 className="font-semibold text-lg line-clamp-2">{note.title}</h3>}

            {/* Content */}
            <div className="text-sm whitespace-pre-wrap">
                {note.content && renderContent(note.content)}
                {note.checkList && note.checkList.length > 0 && (
                    <div className="flex flex-col gap-1 mt-1">
                        {note.checkList.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                                <div
                                    className={cn("w-4 h-4 border border-gray-500 rounded cursor-pointer mt-0.5 flex items-center justify-center", item.isDone && "bg-gray-500 border-gray-500")}
                                    onClick={(e) => { e.stopPropagation(); handleCheckboxToggle(idx); }}
                                >
                                    {item.isDone && <Check size={12} className="text-white" />}
                                </div>
                                <span className={cn("flex-1 break-words", item.isDone && "line-through text-gray-500")}>{item.text}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer / Actions */}
            <div className="mt-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity pt-2">
                {/* Color Picker Trigger */}
                <div className="relative">
                    <button
                        className="p-2 hover:bg-black/10 rounded-full transition-colors"
                        onClick={(e) => { e.stopPropagation(); setShowColorPicker(!showColorPicker); }}
                        title="Change color"
                    >
                        <Palette size={16} />
                    </button>
                    {showColorPicker && (
                        <div className="absolute bottom-full left-0 mb-2 p-2 bg-white dark:bg-zinc-800 shadow-xl rounded-lg flex gap-1 flex-wrap w-[160px] z-10 border border-gray-200 dark:border-zinc-700">
                            {COLORS.map(c => (
                                <button
                                    key={c}
                                    className="w-6 h-6 rounded-full border border-gray-300"
                                    style={{ backgroundColor: c }}
                                    onClick={(e) => { e.stopPropagation(); handleColorChange(c); }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1">
                    <button onClick={(e) => { e.stopPropagation(); handleShare(); }} className="p-2 hover:bg-black/10 rounded-full transition-colors" title="Share/Copy">
                        <Share2 size={16} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleArchive(); }} className="p-2 hover:bg-black/10 rounded-full transition-colors" title={note.isArchived ? "Unarchive" : "Archive"}>
                        <Archive size={16} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(); }} className="p-2 hover:bg-black/10 rounded-full transition-colors hover:text-red-600" title="Delete">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default NoteCard;
