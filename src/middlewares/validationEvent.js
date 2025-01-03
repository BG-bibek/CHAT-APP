const { z } = require("zod");
const Event = require('../models/event');

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
            return res.status(400).json({ error: "Event name already exists." });
        }
        // If valid, proceed to the next middleware/controller
        next();
    } catch (error) {
        // Handle validation errors
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                errors: error.errors.map(e => e.message),
            });
        }
        console.error("Validation error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};


module.exports = {  validateCreateEvent };
