const { z } = require("zod");
const Event = require('../models/event');
const CustomError = require('../errors/custom-error'); // Import CustomError

const eventSchema = z.object({
    eventName: z
        .string()
        .min(4, "Event name must be at least 4 characters long.")
        .regex(/^[a-zA-Z0-9]+$/, "Event name must contain only alphanumeric characters."),
});

const validateCreateEvent = async (req, res, next) => {
    try {
        // Validate the input using Zod
        const data = eventSchema.parse(req.body);

        // Check for uniqueness in the database
        const existingEvent = await Event.findOne({ name: data.eventName });
        if (existingEvent) {
            throw new CustomError("Event name already exists.", 400, "fail");
        }

        // If valid, proceed to the next middleware/controller
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Handle Zod validation errors
            const errorMessage = error.errors.map((e) => e.message).join(", ");
            next(new CustomError(errorMessage, 400, "fail")); // Pass structured error to global handler
        } else if (error instanceof CustomError) {
            // Forward CustomError to global handler
            next(error);
        } else {
            // Handle unexpected errors
            console.error("Unexpected error:", error);
            next(new CustomError("Internal server error.", 500, "error")); // Generic server error
        }
    }
};

module.exports = { validateCreateEvent };
