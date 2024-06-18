import { validationResult } from "express-validator";
export const handleHeadersValidationErrors = (req, res, next) => {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		return res.status(401).send("Unauthorized access.");
	}
	next();
};
