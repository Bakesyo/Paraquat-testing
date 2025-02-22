let currentStep = 1;

function showStep(step) {
    document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
    document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
}

function nextStep() {
    if (validateStep(currentStep)) {
        currentStep++;
        showStep(currentStep);
    }
}

function prevStep() {
    currentStep--;
    showStep(currentStep);
}

function validateStep(step) {
    let isValid = true;
    const formElements = document.querySelector(`.form-step[data-step="${step}"]`).querySelectorAll('input, select');

    formElements.forEach(element => {
        const validationResult = validateField(element.name, element.value);
        updateFieldValidation(element, validationResult);
        if (!validationResult.valid) {
            isValid = false;
        }
    });

    return isValid;
}

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

function updateFieldValidation(field, result) {
    const errorElementId = `${field.id}-error`;
    const errorElement = document.getElementById(errorElementId);

    if (errorElement) {
        errorElement.textContent = result.valid ? '' : result.message;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    showStep(currentStep);
    setupRealTimeValidation();

    const complianceResult = validateCompliance();
    if (!complianceResult.isCompliant) {
      console.error('Compliance Errors:', complianceResult.errors);
      alert('This page has compliance issues. Please review the console for details.');
    }

    const form = document.getElementById('lead-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            // Collect form data
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Submit the form data (replace with your actual submission logic)
            console.log('Form Data:', data);
            submitFormData(data);
        }
    });
});

function handleError(error, context = '') {
    console.error(`Error ${context}: `, error);
    
    // Collect additional context
    const errorData = {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        formStep: currentStep,
        context: context
    };

    // Log to analytics
    gtag('event', 'error', {
        'event_category': 'Error',
        'event_label': error.message,
        'value': currentStep,
        'error_data': JSON.stringify(errorData)
    });

    // Show user-friendly message
    alert('An error occurred. Please try again or contact support if the problem persists.');
}

function formatPhoneNumber(input) {
    const numbers = input.replace(/\D/g, '');
    if (numbers.length === 10) {
        return numbers.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    return input;
}

document.getElementById('phone').addEventListener('input', (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    e.target.value = formatted;
});

async function submitFormData(data) {
    const form = document.getElementById('lead-form');
    const submitButton = form.querySelector('button[type="submit"]');
    
    try {
        // Show loading state
        form.classList.add('loading');
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        const response = await google.script.run
            .withSuccessHandler(formSubmitSuccess)
            .withFailureHandler((error) => {
                handleError(error, 'form_submission');
                form.classList.remove('loading');
                submitButton.disabled = false;
                submitButton.textContent = 'Submit';
            })
            .processNewLead(data);
    } catch (error) {
        handleError(error, 'form_submission');
        form.classList.remove('loading');
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
    }
}

function formSubmitSuccess(response) {
    if (response.success) {
        window.location.href = 'thank-you.html';
    } else {
        alert(`Form submission failed: ${response.error}`);
        const form = document.getElementById('lead-form');
        const submitButton = form.querySelector('button[type="submit"]');
        form.classList.remove('loading');
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
    }
}

function formSubmitError(error) {
    alert('An error occurred while submitting the form.');
    console.error("Error submitting form:", error);
}