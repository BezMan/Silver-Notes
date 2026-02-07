import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Image, Palette, Plus, X, List as ListIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { createNote } from '../api/notesApi';

const COLORS = [
    '#ffffff', '#f28b82', '#fbbc04', '#fff475', '#ccff90', '#a7ffeb',
    '#cbf0f8', '#aecbfa', '#d7aefb', '#fdcfe8', '#e6c9a8', '#e8eaed'
];

const NoteEditor = ({ onNoteCreated }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [isChecklistMode, setIsChecklistMode] = useState(false);
    const [checklistItems, setChecklistItems] = useState([{ text: '', isDone: false }]);

    const [isSaving, setIsSaving] = useState(false);
    const containerRef = useRef(null);

    // Close editor when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                // Determine if we should save or just close
                // For now, let's just close without saving if clicked outside to avoid accidental saves of partial work?
                // Or better, trigger the save logic.
                // Let's stick to the explicit "Save" button for now to be safe, or just collapse if empty.
                if (!isExpanded) return;

                // If clicked outside and has content, we can try to auto-save, but for this specific issue 
                // let's rely on the explicit Save button to debug.
                // Just collapsing if no content or user explicitly closes.
                if (!title.trim() && !content.trim() && !checklistItems.some(i => i.text.trim())) {
                    setIsExpanded(false);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [title, content, checklistItems, isExpanded]);

    const handleSave = async () => {
        if (!isExpanded) return;

        // Validation
        const hasContent = title.trim() || content.trim() || (isChecklistMode && checklistItems.some(i => i.text.trim()));
        if (!hasContent) {
            setIsExpanded(false);
            return;
        }

        setIsSaving(true);
        const noteData = {
            title,
            content: isChecklistMode ? '' : content,
            checkList: isChecklistMode ? checklistItems.filter(i => i.text.trim()) : [],
            bgColor,
        };

        try {
            const newNote = await createNote(noteData);
            onNoteCreated(newNote);

            // Only reset on success
            setTitle('');
            setContent('');
            setBgColor('#ffffff');
            setIsChecklistMode(false);
            setChecklistItems([{ text: '', isDone: false }]);
            setShowColorPicker(false);
            setIsExpanded(false); // Collapse after save
        } catch (error) {
            console.error("Failed to create note", error);
            alert("Failed to save note. Please check if the server is running.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleChecklistChange = (index, value) => {
        const newItems = [...checklistItems];
        newItems[index].text = value;
        setChecklistItems(newItems);
    };

    const handleAddChecklistItem = () => {
        setChecklistItems([...checklistItems, { text: '', isDone: false }]);
    };

    const removeItem = (index) => {
        const newItems = checklistItems.filter((_, i) => i !== index);
        setChecklistItems(newItems);
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-8 relative z-20" ref={containerRef}>
            <motion.div
                layout
                className="rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 overflow-hidden transition-all"
                style={{ backgroundColor: bgColor }}
            >
                {!isExpanded ? (
                    <div
                        className="p-3 text-gray-500 font-medium cursor-text flex items-center justify-between"
                        onClick={() => setIsExpanded(true)}
                    >
                        <span>Take a note...</span>
                        <div className="flex gap-2 text-gray-400">
                            <CheckSquare size={20} />
                            <Image size={20} />
                        </div>
                    </div>
                ) : (
                    <div className="p-4 flex flex-col gap-2">
                        <input
                            type="text"
                            placeholder="Title"
                            className="font-semibold text-lg placeholder-gray-500 bg-transparent text-gray-900"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        {isChecklistMode ? (
                            <div className="flex flex-col gap-2">
                                {checklistItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <Plus size={16} className="text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="List item"
                                            className="flex-1 bg-transparent border-b border-transparent focus:border-gray-300 text-sm py-1 text-gray-900"
                                            value={item.text}
                                            onChange={(e) => handleChecklistChange(idx, e.target.value)}
                                            autoFocus={idx === checklistItems.length - 1}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleAddChecklistItem();
                                                if (e.key === 'Backspace' && !item.text && checklistItems.length > 1) removeItem(idx);
                                            }}
                                        />
                                        {checklistItems.length > 1 && <X size={14} className="cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => removeItem(idx)} />}
                                    </div>
                                ))}
                                <button onClick={handleAddChecklistItem} className="text-sm text-gray-500 hover:text-gray-700 self-start flex items-center gap-1">+ List item</button>
                            </div>
                        ) : (
                            <textarea
                                placeholder="Take a note..."
                                className="resize-none text-sm min-h-[100px] placeholder-gray-500 bg-transparent text-gray-900"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                autoFocus
                            />
                        )}

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-transparent">
                            <div className="flex gap-2">
                                <div className="relative">
                                    <button
                                        className="p-2 hover:bg-black/10 rounded-full transition-colors"
                                        onClick={() => setShowColorPicker(!showColorPicker)}
                                    >
                                        <Palette size={18} className="text-gray-600" />
                                    </button>
                                    {showColorPicker && (
                                        <div className="absolute top-full left-0 mt-2 p-2 bg-white shadow-xl rounded-lg flex gap-1 flex-wrap w-[160px] z-30 border border-gray-200">
                                            {COLORS.map(c => (
                                                <button
                                                    key={c}
                                                    className="w-6 h-6 rounded-full border border-gray-300"
                                                    style={{ backgroundColor: c }}
                                                    onClick={() => { setBgColor(c); setShowColorPicker(false); }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button
                                    className={cn("p-2 hover:bg-black/10 rounded-full transition-colors", isChecklistMode && "bg-black/10")}
                                    onClick={() => setIsChecklistMode(!isChecklistMode)}
                                    title="Tick boxes"
                                >
                                    <CheckSquare size={18} className="text-gray-600" />
                                </button>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-4 py-1.5 font-medium text-sm hover:bg-black/5 rounded text-gray-700 disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default NoteEditor;
