const EMAIL_TEMPLATES = {
  initial_response: {
    subject: 'Your Paraquat Lawsuit Inquiry',
    body: `Dear {{name}},

Thank you for contacting us about your potential Paraquat claim. A legal representative will review your information within 24 hours.

IMPORTANT DISCLAIMERS:
- This is an advertisement for legal services
- This email does not create an attorney-client relationship
- No legal advice is being provided
- Your information is confidential to the extent permitted by law

{{unsubscribeLink}}
    `
  },
  follow_up: {
    subject: 'Important: Additional Information Needed',
    body: `Dear {{name}},

To better evaluate your Paraquat claim, we need additional information about your exposure and medical history.

Please click here to provide more details: {{formLink}}

{{legalDisclaimers}}
{{unsubscribeLink}}
    `
  }
};

function getEmailTemplate(templateName, data) {
  let template = EMAIL_TEMPLATES[templateName];
  return replacePlaceholders(template, data);
}
