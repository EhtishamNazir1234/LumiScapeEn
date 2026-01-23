/**
 * Role-based routing utility
 * Determines the appropriate dashboard route based on user role
 */
export const getRoleBasedRoute = (role) => {
  switch (role) {
    case 'super-admin':
    case 'admin':
      return '/';
    case 'enterprise':
      return '/enterpriseDashboard';
    case 'end-user':
      return '/enterpriseDashboard'; // End users also see enterprise dashboard
    case 'customer-care':
      return '/tickets'; // Customer care goes to tickets dashboard
    default:
      return '/';
  }
};

/**
 * Check if a role has access to a route
 */
export const hasRoleAccess = (userRole, allowedRoles = []) => {
  if (allowedRoles.length === 0) return true;
  return allowedRoles.includes(userRole);
};

/**
 * Get default route for a role (used for redirects)
 */
export const getDefaultRoute = (role) => {
  return getRoleBasedRoute(role);
};
