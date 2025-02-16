import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import ResponseModel from '../utils/responseModel.js';

const register = async (data) => {
    let response = new ResponseModel();
    try {

        const { username, password, email, firstname, lastname, phone } = data;
        const existingUser = await prisma.user.findFirst({
            where: { username },
        });

        if (existingUser) {
            response.success = false;
            response.message = 'Username ถูกใช้แล้ว';
            return response;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username: username,
                firstname: firstname,
                lastname: lastname,
                password: hashedPassword,
                email: email,
                phone: phone || null,
                role: 'U',
            },
        });

        response.success = true;
        response.message = 'ลงทะเบียนสำเร็จ';
        response.data = newUser;
        response.total = 1;

    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }

    return response;
};

const login = async (username, password) => {
    let response = new ResponseModel();
    try {
        const user = await prisma.user.findFirst({ where: { username } });

        if (!user) {
            response.success = false;
            response.message = 'ไม่พบผู้ใช้';
            return response;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            response.success = false;
            response.message = 'รหัสผ่านไม่ถูกต้อง';
            return response;
        }

        if (user.role === 'A') {
            response.success = true;
            response.message = 'เข้าสู่ระบบแอดมินสำเร็จ';
        } else {
            response.success = true;
            response.message = 'เข้าสู่ระบบผู้ใช้สำเร็จ';
        }

        const SECRET_KEY = process.env.SECRET_KEY;

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
            expiresIn: '1h',
        });

        const data = {
            token: token,
            username: username,
            role: user.role
        }

        response.data = data;
        response.total = 1;

    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }

    return response;
};

export default { register, login };
