export default {
  jwt: {
    secret: process.env.APP_SECRET || 'dev-secret',
    expiresIn: '1d',
  },
};
