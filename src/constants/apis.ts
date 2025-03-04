export const apiPaths = {
  auth: {
    login: '/auth/login',
    logout: 'auth/logout',
    register: '/member',
    changePassword: '/member/password',
    deleteAccount: '/member',
    refreshToken: '/auth/refresh',
  },
  gathering: {
    create: '/gatherings',
    getList: '/gatherings',
    edit: '/gatherings',
    delete: '/gatherings',
    getDetail: '/gatherings',
    deleteLocation: '/gatherings',
    addLocation: '/gatherings',
  },
  user: {
    search: '/users/search',
  },
} as const;
