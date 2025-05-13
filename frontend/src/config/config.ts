
// API configuration
export const API_BASE_URL = 'http://localhost:5001/api';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup',
    SIGNIN: '/auth/signin',
    SIGNOUT: '/auth/signout',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    RESEND_VERIFICATION: '/auth/resend-verification-email',
    CHECK_AUTH: '/auth/check-auth'
  },
  GALLERY: {
    UPLOAD: '/gallery/upload-pic'
  },
  GROUP: {
    CREATE: '/group/create',
    JOIN: '/group/join',
    UPLOAD_IMAGE: '/group/groupId/upload',
    GET_IMAGES: '/group/groupId/images',
    GET_INFO: '/group/groupId/info',
    MY_GROUPS: '/group/my-groups',
    GET_MEMBERS: '/group/groupId/members'
  }
};
