const express = require('express');
const router = express.Router();
const { handleFormSubmission, getForms, deleteForm, editForm } = require('../controllers/formController');

router.post('/submit', handleFormSubmission);

router.get('/getform', getForms);

router.delete('/user/:id', deleteForm);
router.put('/user/:id', editForm);

module.exports = router;


