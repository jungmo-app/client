export const apiPaths = {
  auth: {
    login: '/login',
    register: '/member',
    changePassword: '/member/password',
    deleteAccount: '/member',
  },
  gathering: {
    create: '/gatherings',
    getDetail: '/gatherings',
  },
} as const;
