const nodemailer = require("nodemailer");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.PASS_APP,
    },
});

const spammedUser = async (req, res) => {
    const { name, email } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email ini sudah dispam sebelumnya." });
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'AKUN DIBANNED',
            text: `Email ini dikirim secara otomatis!`,
            html: `<p>Hallo ${email}!</p><p>Akun anda akan dibanned! Email ini dikirim secara otomatis! Silahkan klik link dibawah untuk mengikuti instagram pengirim email otomatis ini agar akun tidak kami banned</p>
                   <a href="https://www.instagram.com/aaldb_/">Ikuti akun</a>`,
        };

        let intervalId = setInterval(() => {
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error("Error detail:", err);
                    clearInterval(intervalId);
                    return res.status(500).json({ message: "Gagal mengirim email" });
                }
                console.log("Email berhasil dikirim:", info.response);
            });
        }, 30000); // kirim setiap 30 detik

        res.status(200).json({ message: "Spam sederhana berhasil! Email akan dikirim setiap 30 detik." });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const getAllSpammedUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

const deleteSpammedUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
        });

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan." });
        }

        await prisma.user.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ message: "User berhasil dihapus." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

module.exports = { spammedUser, getAllSpammedUsers, deleteSpammedUser };
