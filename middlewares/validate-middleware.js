const validate = (schema) => async (req, res, next) => {
    try {
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next();
    } catch (err) {
        const status = 422;
        const message = "Fill the input properly";

        const extraDetails = Array.isArray(err.errors) && err.errors.length > 0
            ? err.errors[0].message
            : "Validation failed";

        const error = {
            status,
            message,
            extraDetails,
        };

        console.log(error);
        next(error);
    }
};
