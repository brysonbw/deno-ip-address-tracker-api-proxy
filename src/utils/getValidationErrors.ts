export function getValidationErrors(errors: any) {
	return errors.map((item: any) => item.message);
}
