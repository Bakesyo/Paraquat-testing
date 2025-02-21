function validateCompliance() {
  const requiredElements = {
    disclaimer: {
      pattern: /This communication is not legal advice/i,
      error: 'Missing required legal disclaimer'
    },
    noGuarantees: {
      pattern: /Results may vary/i,
      error: 'Missing results disclaimer'
    },
    unsubscribe: {
      pattern: /unsubscribe/i,
      error: 'Missing unsubscribe option in email templates'
    },
    gdpr: {
      pattern: /data rights|GDPR|CCPA/i,
      error: 'Missing data rights information'
    },
    privacyPolicy: {
      pattern: /privacy policy/i,
      error: 'Missing privacy policy reference'
    },
    attorneyDisclaimer: {
      pattern: /attorney advertising|not legal advice/i,
      error: 'Missing attorney advertising disclaimer'
    },
    attorneyAdvertising: {
      pattern: /attorney advertising|advertisement for legal services/i,
      error: 'Missing attorney advertising disclosure'
    },
    medicalDisclaimer: {
      pattern: /not (intended to provide|a substitute for) medical advice/i,
      error: 'Missing medical advice disclaimer'
    },
    tcpaCompliance: {
      pattern: /consent to (be contacted|receive calls|receive messages)/i,
      error: 'Missing TCPA consent language'
    },
    barRules: {
      pattern: /prior results do not guarantee/i,
      error: 'Missing results disclaimer required by bar rules'
    },
    relationshipDisclaimer: {
      pattern: /does not (create|establish|constitute) an attorney-client relationship/i,
      error: 'Missing attorney-client relationship disclaimer'
    },
    confidentialityDisclaimer: {
      pattern: /confidential to the extent permitted by law/i,
      error: 'Missing proper confidentiality disclaimer'
    }
  };

  const errors = [];
  
  // Check landing page content
  const pageContent = document.body.innerHTML;
  for (const [key, check] of Object.entries(requiredElements)) {
    if (!check.pattern.test(pageContent)) {
      errors.push(check.error);
    }
  }

  // Check form fields for required privacy notice
  const form = document.getElementById('lead-form');
  if (!form.innerHTML.includes('privacy policy')) {
    errors.push('Missing privacy policy reference in form');
  }

  return {
    isCompliant: errors.length === 0,
    errors: errors
  };
}

const US_LEGAL_REQUIREMENTS = {
  attorneyAdvertising: {
    pattern: /attorney advertising|advertisement for legal services/i,
    error: 'Missing attorney advertising disclosure'
  },
  medicalDisclaimer: {
    pattern: /not (intended to provide|a substitute for) medical advice/i,
    error: 'Missing medical advice disclaimer'
  },
  tcpaCompliance: {
    pattern: /consent to (be contacted|receive calls|receive messages)/i,
    error: 'Missing TCPA consent language'
  },
  barRules: {
    pattern: /prior results do not guarantee/i,
    error: 'Missing results disclaimer required by bar rules'
  },
  relationshipDisclaimer: {
    pattern: /does not (create|establish|constitute) an attorney-client relationship/i,
    error: 'Missing attorney-client relationship disclaimer'
  },
  confidentialityDisclaimer: {
    pattern: /confidential to the extent permitted by law/i,
    error: 'Missing proper confidentiality disclaimer'
  }
};

function validateStateSpecificCompliance(state) {
  const stateRules = getStateBarRules(state);
  // State-specific validation
  return stateRules.every(rule => rule.test(content));
}

function validateTCPACompliance() {
  // Check for proper consent mechanisms
  const consentElements = [
    'written consent',
    'automated calls/texts',
    'revocation right'
  ];
  // Validation logic
}

function validateEmailTemplate(template) {
  // Add email template validation
  const required = ['unsubscribe', 'disclaimer'];
  // Validation logic here
}
