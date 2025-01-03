const { z } = require("zod");

const loginSchema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters long." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

const validateLoginRequest = (req, res, next) => {
    try {
        loginSchema.parse(req.body); 
        next();
    } catch (error) {
        res.status(400).json({ error: error.errors.map((err) => err.message) }); 
    }
};

module.exports = { validateLoginRequest };
