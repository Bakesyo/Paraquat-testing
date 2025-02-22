const VALIDATION_RULES = {
    fullName: {
        pattern: /^[a-zA-Z\s]+$/,
        message: 'Please enter a valid name.'
    },
    phone: {
        pattern: /^\(\d{3}\) \d{3}-\d{4}$/,
        message: 'Please enter a valid phone number in the format (XXX) XXX-XXXX.'
    },
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address.'
    },
    state: {
        custom: (value) => {
            const validStates = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
            return validStates.includes(value);
        },
        message: 'Please select a valid state.'
    },
    exposureDate: {
        custom: (value) => {
            return !isNaN(new Date(value));
        },
        message: 'Please enter a valid date.'
    }
};
