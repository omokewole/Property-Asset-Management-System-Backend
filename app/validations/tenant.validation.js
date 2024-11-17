import Joi from "joi";
import { phoneValidation } from "../utils/validatePhone.js";

export const tenantValidationSchema = Joi.object({
  name: Joi.string().required(),
  assigned_property: Joi.string().required(),
  assigned_unit: Joi.number().required(),
  phone: Joi.string()
    .required()
    .custom(phoneValidation, "Phone number validation")
    .messages({
      "string.empty": "Phone number is required!",
    }),

  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  rent_paid: Joi.number().required(),
  balance: Joi.number(),
});
