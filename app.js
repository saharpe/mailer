const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

// Initiate app
const app = express();
dotenv.config();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Service endpoint
app.post('/email/send', async (req, res) => {

    // HTML output of the email
    const output = `
        <h2>
            <u> New Contact Request </u>
        </h2>
        <h3> Contact details </h3>
        <ul>
            <li> 
                <u> Name: </u> ${req.body.name} 
            </li>
            <li> 
                <u> Email: </u> ${req.body.email} 
            </li>
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
            to: "saharpe.dev@gmail.com",
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