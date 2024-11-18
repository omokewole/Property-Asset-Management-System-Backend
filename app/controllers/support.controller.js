import { startChat } from "../services/support.service.js";
import { responseModel } from "../utils/responseModel.js";

export async function handleStartChat(req, res) {
	try {
		const { message } = req.body;
		let image_url;
		const user_id = req.user._id;
		const imgFile = req.file;

		if (imgFile) {
			//Do something
		}

		const response = await startChat({
			user_id,
			message,
			image_url,
		});

		res
			.status(201)
			.json(responseModel(true, "Chat started successfully", response));
	} catch (error) {
		res
			.status(error.status || 500)
			.json(responseModel(false, error.message || "An error occured"));
	}
}
