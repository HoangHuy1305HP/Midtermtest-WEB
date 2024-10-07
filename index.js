import express from 'express';
import mongoose from 'mongoose';
import UserModel from './models/UserModel.js';
import ProfileModel from './models/ProfileModel.js';
import WorkExperienceModel from './models/WorkExperienceModel.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
console.log('MONGODB_URL:', process.env.MONGODB_URL); // Thêm dòng này để kiểm tra
await mongoose.connect(process.env.MONGODB_URL);

const app = express();
app.use(express.json());
const saltRounds = 10;

// Đăng ký người dùng
app.post('/users/register', async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        if (!userName || !email || !password) throw new Error("Thiếu thông tin");

        const existEmail = await UserModel.findOne({ email });
        if (existEmail) throw new Error("Email đã tồn tại");

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await UserModel.create({ userName, email, password: hashedPassword });

        res.status(201).send({ message: 'Đăng ký thành công!', data: newUser });
    } catch (error) {
        res.status(403).send({ message: error.message });
    }
});

// Đăng nhập người dùng
app.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) throw new Error("Thiếu thông tin đăng nhập");

        const user = await UserModel.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error("Sai tài khoản hoặc mật khẩu");
        }

        res.status(200).send({ message: 'Đăng nhập thành công!', userId: user._id });
    } catch (error) {
        res.status(403).send({ message: error.message });
    }
});

// Thêm thông tin cá nhân
app.post('/profiles', async (req, res) => {
    try {
        const { userId, fullName, dateOfBirth, birthplace, nationality, education, hobbies, goals } = req.body;
        if (!userId || !fullName || !dateOfBirth) throw new Error("Thiếu thông tin cá nhân");

        const newProfile = await ProfileModel.create({ userId, fullName, dateOfBirth, birthplace, nationality, education, hobbies, goals });
        res.status(201).send({ message: 'Thêm thông tin cá nhân thành công!', data: newProfile });
    } catch (error) {
        res.status(403).send({ message: error.message });
    }
});

// Thêm kinh nghiệm làm việc
app.post('/work-experience', async (req, res) => {
    try {
        const { userId, skills, projects, workHistory } = req.body;
        if (!userId) throw new Error("Thiếu thông tin người dùng");

        const newWorkExperience = await WorkExperienceModel.create({ userId, skills, projects, workHistory });
        res.status(201).send({ message: 'Thêm kinh nghiệm làm việc thành công!', data: newWorkExperience });
    } catch (error) {
        res.status(403).send({ message: error.message });
    }
});

// Lấy thông tin cá nhân và kinh nghiệm làm việc
app.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const profile = await ProfileModel.findOne({ userId });
        const workExperience = await WorkExperienceModel.findOne({ userId });

        if (!profile && !workExperience) {
            return res.status(404).send({ message: "Không tìm thấy thông tin người dùng" });
        }

        res.status(200).send({
            message: 'Lấy thông tin thành công!',
            profile,
            workExperience,
        });
    } catch (error) {
        res.status(403).send({ message: error.message });
    }
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
