export const ROLE_DASHBOARD = {
  admin: '/admin/dashboard',
  shipper: '/shipper/dashboard',
  customer: '/',
};

export const VALID_ROLES = Object.keys(ROLE_DASHBOARD);

export const PROTECTED_ROUTES = [
  { path: '/admin/dashboard', roles: ['admin'] },
  { path: '/admin/dishes', roles: ['admin'] },
  { path: '/shipper/dashboard', roles: ['shipper'] },
];

export const getDashboardPath = (role) => {
  if (!role || !ROLE_DASHBOARD[role]) {
    return '/';
  }
  return ROLE_DASHBOARD[role];
};
