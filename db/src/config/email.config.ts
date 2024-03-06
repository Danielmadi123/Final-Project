import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hanilzx8@gmail.com',
    pass: 'lsxmfadqtncpnrhw ',
  },
});

export const emailConfig = {
  service: 'gmail',
  auth: {
    user: 'hanilzx8@gmail.com',
    pass: 'lsxm fadq tncp nrhw ',
  },
};