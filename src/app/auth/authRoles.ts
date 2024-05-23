/**
 * The authRoles object defines the authorization roles for the Fuse application.
 */
const authRoles = {
	/**
	 * The admin role grants access to users with the 'admin' role.
	 */
	admin: ['admin'],

	/**
 * The manager role grants access to users with the 'manager' role.
 */
	manager: ['Manager'],

	/**
	 * The staff role grants access to users with the 'admin' or 'staff' role.
	 */
	staff: ['staff'],

	/**
	 * The user role grants access to users with the 'admin', 'staff', or 'user' role.
	 */
	user: ['admin', 'manager', 'staff'],

	/**
	 * The onlyGuest role grants access to unauthenticated users.
	 */
	onlyGuest: [],
};

export default authRoles;
