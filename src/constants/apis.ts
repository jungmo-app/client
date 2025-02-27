export const apiPaths = {
  auth: {
    login: '/login',
    register: '/member',
    changePassword: '/member/password',
    deleteAccount: '/member',
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
