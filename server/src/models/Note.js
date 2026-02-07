const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  checkList: [{
    text: String,
    isDone: { type: Boolean, default: false }
  }],
  labels: [{
    type: String,
    trim: true
  }],
  bgColor: {
    type: String,
    default: '#ffffff' // Default white, or could be a theme color
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Index for search (optional but good for performance if scaling)
NoteSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Note', NoteSchema);
