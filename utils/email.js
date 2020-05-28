const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const hbs = require('nodemailer-express-handlebars');
var sgTransport = require('nodemailer-sendgrid-transport');

module.exports = class Email {
  constructor(user, url) {
    this.firstName = user.name.split(' ')[0];
    this.to = user.email;
    this.from = 'Amit Kumar <amitdtu@gmail.com>';
    this.url = url;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // 1) render html template
    const html = 'some html template';

    // 2) define email mailOptions
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: htmlToText.fromString(html),
      template,
      context: {
        name: this.firstName,
        url: this.url,
      },
    };

    // 3) create transport and send email
    await this.newTransport()
      .use(
        'compile',
        hbs({
          viewEngine: {
            extName: '.handlebars',
            partialsDir: 'dev-data/emailTemplates',
            layoutsDir: 'dev-data/emailTemplates',
            defaultLayout: `${template}.handlebars`,
          },
          viewPath: './dev-data/emailTemplates/',
        })
      )
      .sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family');
  }

  // we can send resetToken with sucess mesaage and redirect the user to reset password page
  // instead of sending email
  async sendResetPassword() {
    await this.send('resetPassword', 'Reset Password (valid for 10 minutes)');
  }
};
