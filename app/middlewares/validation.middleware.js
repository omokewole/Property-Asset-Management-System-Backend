import { responseModel } from "../utils/responseModel.js";

export default function validateMiddleware(schema) {
	return (req, res, next) => {
		if (schema) {
			const result = schema.validate(req.body);

			if (result.error) {
				return res
					.status(422)
					.json(responseModel(false, "Validation error", result.error));
			}

			next();
		}
	};
}
