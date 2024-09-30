import jwt from 'jsonwebtoken';
export function jwtVerify(userToken) {
	let jwtVerified;
	if (userToken) {
		jwtVerified = jwt.verify(userToken, process.env.TOKEN_SECRET);
	}
	return jwtVerified;
}
