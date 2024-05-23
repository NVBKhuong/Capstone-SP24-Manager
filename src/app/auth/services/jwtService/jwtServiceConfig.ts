/**
 * Configuration object containing the authentication service API endpoints
 */
const jwtServiceConfig = {
	signIn: 'https://bfs.monoinfinity.net/api/auth/managers',
	signIn2: 'api/auth/sign-in',
	signUp: 'api/auth/sign-up',
	accessToken: 'https://bfs.monoinfinity.net/api/managers/informations',
	updateUser: 'api/auth/user/update'
};

export default jwtServiceConfig;
