angular.module('constants')
    .constant('customEvents', {
        leftMenu: {
            closeLeftMenu: 'close-left-menu'
        },
        general: {
            logIn: 'user-login',
            logOut: 'user-logout',
            sessionExpired: 'user-session-expired',
            userNotAuthenticated: 'user-not-authenticated'
        }
    });