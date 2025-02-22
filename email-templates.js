const EMAIL_TEMPLATES = {
  autoResponse: `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Thank You for Your Inquiry</title>
    </head>
    <body>
      <p>Dear {{name}},</p>
      <p>Thank you for contacting us. We have received your inquiry and will be in touch soon.</p>
      <p><a href="{{unsubscribeLink}}">Unsubscribe</a></p>
    </body>
    </html>
  `,
  priorityNotification: `
    <!DOCTYPE html>
    <html>
    <head>
      <title>High-Priority Lead Notification</title>
    </head>
    <body>
      <p>A high-priority lead has been submitted:</p>
      <ul>
        <li>Name: {{name}}</li>
        <li>Email: {{email}}</li>
        <li>Phone: {{phone}}</li>
      </ul>
    </body>
    </html>
  `
};
