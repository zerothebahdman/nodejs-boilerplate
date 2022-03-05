import { resolve } from 'node:path';
import Email from 'email-templates';
import config from 'config';
import NodemailerModule from '../modules/NodemailerModule';
import log from '../logging/logger';
import { User } from './User.service';
import { Request } from 'express';
const _nodeMailerModule = new NodemailerModule();

type EmailType = {
  [k: string]: string[];
};

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

const emailType: EmailType = {
  WELCOME_EMAIL: ['Welcome to Clean Nodejs Boilerplate', 'welcome'],
  PASSWORD_RESET_INSTRUCTION: ['Password Reset Requested', 'password-reset'],
  PASSWORD_RESET_SUCCESSFUL: ['Password Reset', 'password-reset-successful'],
  PASSWORD_CHANGED: ['Password Changed', 'password-changed'],
  EMAIL_VERIFICATION: ['Email Verification Requested', 'email-verification'],
};

type Data = { _user_name: string; verificationUrl: string };

export default class EmailService {
  /** Send email takes the following arguements:
   * type - refers to the type of the email eg WelcomeEmail
   * to - refers to who you are sending the email to
   * data - refers to what you want to send to the user
   */
  async _sendEmail(type: string, users_email: string, data: Data) {
    // if (config.get<string>('env') === 'development')
    //   return `Email sent to ${to}`;
    const [subject, templatePath] = emailType[type] || [];
    if (!subject || !templatePath) return;
    const html = await email.render(`templates/${templatePath}`, data);
    try {
      await _nodeMailerModule.send({
        from: config.get<string>('from'),
        to: users_email,
        html,
        name: config.get<string>('name'),
        subject,
      });
      log.info(`Email sent to ${users_email}`);
    } catch (err) {
      throw err;
    }
  }

  async _sendWelcomeEmail() {}

  async _sendUserEmailVerificationEmail(
    _user_name: string,
    _user_email: string,
    token: string,
    req: Request
  ) {
    const verificationUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/user/verify-email/${token}`;

    log.info(verificationUrl);

    return await this._sendEmail('EMAIL_VERIFICATION', _user_email, {
      _user_name,
      verificationUrl,
    });
  }

  async _sendUserPasswordResetInstructionEmail() {}

  async _sendPasswordResetSuccessfulEmail() {}

  async _sendUserPasswordChangedEmail() {}
}
