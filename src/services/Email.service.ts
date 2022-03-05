import { resolve } from 'node:path';
import Email from 'email-templates';

const email = new Email({
  juice: true,
  juiceSettings: { tableElements: ['TABLE'] },
  juiceResources: {
    preserveImportant: true,
    webResources: {
      relativeTo: resolve('public/email'),
    },
  },
  views: {
    root: resolve('public/email'),
    options: {
      extension: 'ejs',
    },
  },
});

const emailType = {
  WELCOME_EMAIL: ['Welcome to Clean Nodejs Boilerplate', 'welcome'],
  PASSWORD_RESET_INSTRUCTION: ['Password Reset Requested', 'password-reset'],
  PASSWORD_RESET_SUCCESSFUL: ['Password Reset', 'password-reset-successful'],
  PASSWORD_CHANGED: ['Password Changed', 'password-changed'],
  EMAIL_VERIFICATION: ['Email Verification Requested', 'email-verification'],
};

export default class EmailService {
  consructor() {}
}
