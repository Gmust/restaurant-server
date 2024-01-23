import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { google } from 'googleapis';

import { SendConfirmMailDto } from './dto/send-confirm-mail.dto';
import { SendEventMailDto } from './dto/send-event-mail.dto';
import { SendMailDto } from './dto/send-mail.dto';
import { SendMailDocumentDto } from './dto/send-mail-document.dto';

@Injectable()
export class MailingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService
  ) {}

  private async setTransport() {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      this.configService.get('CLIENT_ID'),
      this.configService.get('CLIENT_SECRET'),
      process.env.OAUTHREDIRECTURI
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken: string = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject('Failed to create access token');
        }
        resolve(token);
      });
    });

    const config = {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get('EMAIL'),
        clientId: this.configService.get('CLIENT_ID'),
        clientSecret: this.configService.get('CLIENT_SECRET'),
        accessToken,
      },
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.mailerService.addTransporter('gmail', config);
  }

  public async sendResetPasswordMail({ resetLink, email }: SendMailDto) {
    await this.setTransport();
    await this.mailerService.sendMail({
      transporterName: 'gmail',
      to: email,
      from: '4orgood@gmail.com',
      subject: 'Password Reset',
      template: 'reset-password-template',
      context: {
        email,
        resetLink,
      },
    });
  }

  public async sendConfirmationMail({ subject, template, link, email }: SendConfirmMailDto) {
    await this.setTransport();
    await this.mailerService.sendMail({
      transporterName: 'gmail',
      to: email,
      from: 'noreply@nestjs.com',
      subject: subject,
      template: template,
      context: {
        email,
        link,
      },
    });
  }

  public async sendMailWithAttachment({ email, document, template, subject }: SendMailDocumentDto) {
    await this.setTransport();

    const attachment = {
      filename: 'order_document.pdf',
      content: Buffer.from(document),
    };

    await this.mailerService.sendMail({
      transporterName: 'gmail',
      to: email,
      from: '4orgood@gmail.com',
      subject: subject,
      attachments: [attachment],
      template: template,
    });
  }

  public async sendEventMail({ subject, template, email, eventDescription }: SendEventMailDto) {
    await this.setTransport();

    await this.mailerService.sendMail({
      transporterName: 'gmail',
      to: email,
      from: '4orgood@gmail.com',
      subject: subject,
      template: template,
      context: {
        email,
        eventDescription,
      },
    });
  }

  //TODO create service for different notification mails
}
