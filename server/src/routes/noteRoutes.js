const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

router.get('/', noteController.getNotes);
router.post('/', noteController.createNote);
router.put('/:id', noteController.updateNote);
router.patch('/:id', noteController.patchNote);
router.delete('/:id', noteController.deleteNote);

module.exports = router;
