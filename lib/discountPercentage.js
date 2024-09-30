export default function discountPercentage(coursePrice, courseDiscount) {
	// Ensure both inputs are numbers

	if (typeof coursePrice !== 'number' || typeof courseDiscount !== 'number') {
		throw new Error('Both coursePrice and courseDiscount must be numbers');
	}

	// Ensure discount is not negative
	if (courseDiscount < 0) {
		throw new Error('courseDiscount cannot be negative');
	}

	// Handle the case of both coursePrice and courseDiscount being zero
	let discountPercentage;
	if (coursePrice - courseDiscount < 1) {
		discountPercentage = 100;
		return discountPercentage; // 100% off
	}

	// Calculate the percentage discount
	if (coursePrice === 0) {
		discountPercentage = 100; // If coursePrice is zero, it's effectively 100% off
	} else {
		discountPercentage = Math.round((courseDiscount / coursePrice) * 100);
	}

	return discountPercentage;
}
