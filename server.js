require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Body parser middleware to parse form data
app.use(bodyParser.json());

// Serve static files (e.g., HTML, CSS, JS) from the 'public' folder
app.use(express.static('public'));

// Define a route for the root URL
app.get('/', (req, res) => {
    res.sendFile('public/index.html'); // Assuming index.html is in the root directory
});

// Route to handle POST request
app.post('/submit-form', (req, res) => {
    console.log('Form submission received:', req.body);
    const { name, gender, age, affiliation, size, email, phone } = req.body;
    
    // Nodemailer setup
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // For example, using Gmail
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: 'contact@ononcompany.com',
        to: 'visionpjt@ononcompany.com', // where you want to receive the form data
        subject: '사전예약 신청서 제출 알림',
        text: `다음 세부 정보가 포함된 새 사전예약 주문이 제출되었습니다\n\n이름: ${name}\n성별: ${gender}\n연령: ${age}\n소속: ${affiliation}\n크기: ${size}\n이메일: ${email}\n전화번호: ${phone}`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Error sending email' });
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).json({ success: true, message: 'Form Submitted Successfully!' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
