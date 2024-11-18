import { responseModel } from "../utils/responseModel.js";

export function adminMiddleware(req, res, next) {
	if (!req.user || req.user.role !== "admin") {
		return res
			.status(403)
			.json(responseModel(false, "Access denied. Admins only"));
	}
	next();
}
