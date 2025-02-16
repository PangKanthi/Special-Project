import authService from "../services/authService.js";

const register = async (req, res, next) => {
    try {
        const response = await authService.register(req.body);
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const response = await authService.login(username, password);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

export { register, login };
