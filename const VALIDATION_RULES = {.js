const VALIDATION_RULES = {
  phone: {
    pattern: /^(\+1)?[0-9]{10}$/,
    message: 'Please enter a valid US phone number'
  },
  zip: {
    pattern: /^[0-9]{5}(-[0-9]{4})?$/,
    message: 'Please enter a valid ZIP code'
  },
  exposureDate: {
    custom: (value) => {
      const date = new Date(value);
      return date <= new Date() && date >= new Date('1960-01-01');
    },
    message: 'Please enter a valid exposure date between 1960 and present'
  },
  fullName: {
    pattern: /^[a-zA-Z\s]+$/,
    message: "Please enter a valid full name"
  },
  email: {
    pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
    message: "Please enter a valid email address"
  }
};

function validateField(field, value) {
  const rule = VALIDATION_RULES[field];
  if (!rule) return { valid: true };

  if (rule.pattern && !rule.pattern.test(value)) {
    return { valid: false, message: rule.message };
  }

  if (rule.custom && !rule.custom(value)) {
    return { valid: false, message: rule.message };
  }

  return { valid: true };
}

function setupRealTimeValidation() {
  const form = document.getElementById('lead-form');
  form.addEventListener('input', (e) => {
    const field = e.target;
    const result = validateField(field.name, field.value);
    updateFieldValidation(field, result);
  });
}
