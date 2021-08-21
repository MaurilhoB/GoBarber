interface MailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      email: string | undefined;
      name: string | undefined;
    };
  };
}

export default {
  driver: process.env.APP_MAIL_DRIVER || 'ethereal',
  defaults: {
    from: {
      email: process.env.SEND_EMAIL_DOMAIN,
      name: process.env.SENDER_NAME,
    },
  },
} as MailConfig;
