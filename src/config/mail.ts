interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_PROVIDER || 'ethereal',
  defaults: {
    from: { email: 'marlon@maistre.com.br', name: 'Marlon' },
  },
} as IMailConfig;
