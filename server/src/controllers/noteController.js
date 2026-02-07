const Note = require('../models/Note');

// GET all notes
exports.getNotes = async (req, res) => {
    try {
        const { isArchived, label, search } = req.query;
        let query = {};

        if (isArchived !== undefined) {
            query.isArchived = isArchived === 'true';
        }

        if (label) {
            query.labels = label;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        const notes = await Note.find(query).sort({ updatedAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST new note
exports.createNote = async (req, res) => {
    const note = new Note(req.body);
    try {
        const newNote = await note.save();
        res.status(201).json(newNote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT update note (full update)
exports.updateNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!note) return res.status(404).json({ message: 'Note not found' });
        res.json(note);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PATCH partial update
exports.patchNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        if (!note) return res.status(404).json({ message: 'Note not found' });
        res.json(note);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE note
exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);
        if (!note) return res.status(404).json({ message: 'Note not found' });
        res.json({ message: 'Note deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
