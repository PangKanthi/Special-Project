import authService from "../services/authService.js";

const register = async (req, res) => {
    try {
        const response = await authService.register(req.body);
        res.status(200).json(response);
    } catch (error) {
        res.status(200).json({ success: false, message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const response = await authService.login(username, password);
        res.status(200).json(response);
    } catch (error) {
        res.status(200).json({ success: false, message: error.message });
    }
};

export default { register, login };