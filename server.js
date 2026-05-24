require("dotenv").config();

const express = require("express");

const cors = require("cors");

const bodyParser = require("body-parser");

const nodemailer = require("nodemailer");

const fetch = require("node-fetch");

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(bodyParser.json());

/* =========================
   MAIL CONFIGURATION
========================= */

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS

    }

});

/* =========================
   CONTACT API
========================= */

app.post("/send", async (req, res) => {

    try {

        /* GET FORM DATA */

        const {

            name,
            email,
            phone,
            message

        } = req.body;

        console.log(req.body);

        /* =========================
           EMAIL TEMPLATE
        ========================= */

        const mailOptions = {

            from: process.env.EMAIL_USER,

            to: process.env.EMAIL_USER,

            subject: "🚀 New Portfolio Contact Message",

            html: `

                <div style="
                    font-family:Arial;
                    background:#0f172a;
                    padding:30px;
                    color:white;
                    border-radius:10px;
                ">

                    <h1 style="
                        color:#00ffff;
                        margin-bottom:30px;
                    ">
                        New Portfolio Contact
                    </h1>

                    <p style="font-size:18px;">
                        <b>👤 Name:</b> ${name}
                    </p>

                    <p style="font-size:18px;">
                        <b>📧 Email:</b> ${email}
                    </p>

                    <p style="font-size:18px;">
                        <b>📱 Phone:</b> ${phone}
                    </p>

                    <p style="font-size:18px;">
                        <b>💬 Message:</b>
                    </p>

                    <div style="
                        background:#111827;
                        padding:20px;
                        border-radius:10px;
                        margin-top:10px;
                    ">

                        ${message}

                    </div>

                </div>

            `
        };

        /* =========================
           SEND EMAIL
        ========================= */

        await transporter.sendMail(mailOptions);

        /* =========================
           TELEGRAM MESSAGE
        ========================= */

        const telegramMessage = `

🚀 NEW PORTFOLIO CONTACT

👤 Name: ${name}

📧 Email: ${email}

📱 Phone: ${phone}

💬 Message:
${message}

`;

        /* =========================
           SEND TELEGRAM
        ========================= */

        await fetch(

            `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    chat_id: process.env.TELEGRAM_CHAT_ID,

                    text: telegramMessage

                })

            }

        );

        /* =========================
           SUCCESS RESPONSE
        ========================= */

        res.status(200).json({

            message: "Message Sent Successfully 🚀"

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Error Sending Message"

        });

    }

});

/* =========================
   START SERVER
========================= */

app.listen(5000, () => {

    console.log("Server Running On Port 5000");

});