const sgMail = require('@sendgrid/mail');
const config = require('enviro-conf');

const TO_EMAIL = config.get('TO_EMAIL');
const SENDGRID_API_KEY = config.get('SENDGRID_API_KEY');

module.exports = async content => {
  sgMail.setApiKey(SENDGRID_API_KEY);
  const msg = {
    to: TO_EMAIL.split(','),
    from: 'train@delays',
    subject: 'New Delays',
    html: content,
  };
  const result = await sgMail.send(msg);
  return result[0];
};