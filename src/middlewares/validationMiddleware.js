const { z } = require("zod");
const CustomError = require("../errors/custom-error"); // Import CustomError

const loginSchema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters long." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

const validateLoginRequest = (req, res, next) => {
    try {
        loginSchema.parse(req.body); 
        next();
    } catch (error) {
        const errorMessage = error.errors.map((err) => err.message).join(", ");
        next(new CustomError(errorMessage, 400, "fail"));
    }
};

module.exports = { validateLoginRequest };
