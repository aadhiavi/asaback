const nodemailer = require('nodemailer');
const AsaForm = require('../models/formModel');
require('dotenv').config();

const sendAdminEmail = (formData) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'New Form Submission',
        text: `New form submission:\n\nName: ${formData.name}\nNumber: ${formData.number}\nEmail: ${formData.email}\nMessage: ${formData.message}`,
    };

    return transporter.sendMail(mailOptions);
};

const sendConfirmationEmail = (userEmail, formData) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Form Submission Confirmation',
        text: `Hello ${formData.name},\n\nThank you for contacting ASA. Your submission has been received. Please wait for a moment, and one of our team members will reach out to you shortly.\n\nBest regards,\nYour ASA Home Health Care Services,\nContact: +91 8008889648`,
    };

    return transporter.sendMail(mailOptions);
};

const handleFormSubmission = async (req, res) => {
    try {
        const { name, number, email, message } = req.body;

        if (!name || !number || !email || !message) {
            return res.status(400).json({ message: 'All fields are required', error: 'Missing field' });
        }

        const existingForm = await AsaForm.findOne({email,number });

        if (existingForm) {
            return res.status(400).json({ message: 'This email or phone number has already been used to submit a form.' });
        }

        const form = new AsaForm({ name, number, email, message });
        await form.save();

        await sendAdminEmail({ name, number, email, message });
        await sendConfirmationEmail(email, { name, number, email, message });

        res.status(200).json({ message: 'Form submitted successfully!' });
    } catch (error) {
        console.error('Error handling form submission:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};




const getForms = async (req, res) => {
    try {
        const forms = await AsaForm.find();
        res.status(200).json(forms);
    } catch (error) {
        console.error('Error fetching forms', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteForm = async (req, res) => {
    try {
        const { id } = req.params;
        const form = await AsaForm.findByIdAndDelete(id);

        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        res.status(200).json({ message: 'Form deleted successfully' });
    } catch (error) {
        console.error('Error deleting form', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const editForm = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, number, email, message } = req.body;

        if (!name || !number || !email || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const form = await AsaForm.findByIdAndUpdate(
            id,
            { name, number, email, message },
            { new: true }
        );

        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        res.status(200).json({ message: 'Form updated successfully', form });
    } catch (error) {
        console.error('Error updating form', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports = { handleFormSubmission, getForms, deleteForm, editForm };

