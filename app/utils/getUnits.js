export function updateUnitAvailability(property, selectedUnit) {
	const { unit_number, occupied_units = [] } = property;

	const all_units = Array.from({ length: unit_number }, (_, i) => i + 1);

	const available_units = all_units.filter(
		(unit) => !occupied_units.includes(unit)
	);

	if (selectedUnit && available_units.includes(selectedUnit)) {
		const updatedAvailableUnits = available_units.filter(
			(unit) => unit !== selectedUnit
		);
		const updatedOccupiedUnits = [...occupied_units, selectedUnit];

		return {
			available_units: updatedAvailableUnits,
			occupied_units: updatedOccupiedUnits,
		};
	}

	return {
		available_units,
		occupied_units,
		all_units,
	};
}
