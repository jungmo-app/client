export const apiPaths = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
    changePassword: '/auth/password',
    setPassword: '/auth/set-password',
    resetPassword: '/auth/reset-password',
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
    editInfo: '/users/info',
  },
  place: {
    autoComplete: '/maps/autocomplete',
  },
  notification: {
    getNotification: '/sse/notifications',
    deleteNotification: '/sse/notifications',
    readNotification: '/sse/notifications',
    subscribe: '/sse/subscribe',
  },
} as const;
