import Joi from "joi";

const addPropertySchema = Joi.object({
  title: Joi().string().required(),
});

// "title": "Rustic Metal Bike",
// "street": "{{$randomStreetAddress}}",
// "location": "{{$randomLocale}}",
// "description": "{{$randomJobDescriptor}}",
// "type": "residential",
// "unit_number": 10,
// "attraction": [
//     "{{$randomAdjective}}"
// ]
