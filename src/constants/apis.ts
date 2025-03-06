export const apiPaths = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/member',
    changePassword: '/member/password',
    refreshToken: '/auth/refresh',
    checkBlacklist: '/auth/isBlacklist',
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
    userInfo: '/users/info',
    search: '/users/search',
    deleteAccount: '/users/info',
  },
} as const;
