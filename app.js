const express = require('express');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

// Initiate app
const app = express();
dotenv.config();

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Service endpoint
app.post('/email/send', async (req, res) => {

    // HTML output of the email
    const output = `
        <h2><u> New Contact Request </u></h2>
        <h3> Contact details </h3>
        <ul>
            <li> Name: ${req.body.name} </li>
            <li> Email: ${req.body.email} </li>
            <li> Phone: ${req.body.phone} </li>
        </ul>
        <h3> Message </h3>
        <p> ${req.body.message} </p>
    `;

    // Email credentials
    let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    try {
        let info = await transporter.sendMail({
            from: 'Mailer <saharpe.mailer@gmail.com>',
            to: "ptz.sahar@gmail.com",
            subject: "New Contact Request",
            html: output,
        });

        res.json({ messageId: info.messageId });

    } catch (error) {
        res.status(400).send({ message: error });
    }
});

// Run server on port
app.listen(process.env.PORT, () => console.log(`Server is running on http://localhost:${process.env.PORT}`));