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
    const errorElementId = `${field.name}-error`; // Use field.name instead of field.id
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
    const originalButtonText = submitButton.textContent; // Store original text
    
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
                submitButton.textContent = originalButtonText; // Restore original text
            })
            .processNewLead(data);
    } catch (error) {
        handleError(error, 'form_submission');
        form.classList.remove('loading');
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText; // Restore original text
    }
}

function formSubmitSuccess(response) {
    const form = document.getElementById('lead-form');
    const submitButton = form.querySelector('button[type="submit"]');
    form.classList.remove('loading');
    submitButton.disabled = false;
    submitButton.textContent = 'Submit'; // Ensure button is reset

    if (response.success) {
        window.location.href = 'thank-you.html';
    } else {
        alert(`Form submission failed: ${response.error}`);
    }
}

function formSubmitError(error) {
    alert('An error occurred while submitting the form.');
    console.error("Error submitting form:", error);
}

function addLeadToSheet(sheet, leadData) {
  // ...existing code...
}

function validateAndSanitizeData(formResponse) {
  // ...existing code...
}

function getEmailTemplate(templateName) {
  // ...existing code...
}

function generateUnsubscribeLink(email) {
  // ...existing code...
}

function logLeadActivity(rowId, activity) {
  // ...existing code...
}

function trackConversion(leadData) {
  // ...existing code...
}

function isQualifiedLead(leadData) {
  // ...existing code...
}

function postToAnalytics(analyticsData) {
  // ...existing code...
}

function getActiveTestVariant() {
  // ...existing code...
}

function getExposureDate(exposureYears) {
  // ...existing code...
}

function processNewLead(formData) {
  // ...existing code...
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const rowId = addLeadToSheet(sheet, leadData);
    
    logLeadActivity(rowId, 'Lead created');
    
    trackConversion(leadData);

    if (isQualifiedLead(leadData)) {
      sendPriorityNotification(leadData);
      logLeadActivity(rowId, 'Priority notification sent');
    }

    sendAutoResponse(leadData);
    return { success: true, leadId: rowId };
  } catch (error) {
    trackError(error, 'processNewLead', formData);
    console.error("Error in processNewLead:", error); // Add this line
    return { success: false, error: 'An unexpected error occurred. Our team has been notified.' };
  }
}

function sendPriorityNotification(leadData) {
  // ...existing code...
}

function sendAutoResponse(leadData) {
  // ...existing code...
}

function isWithinStatuteOfLimitations(state, diagnosisDate) {
  // ...existing code...
}

function scoreLead(leadData) {
  // ...existing code...
}

function setupErrorTracking() {
  // ...existing code...
}

function trackError(error, functionName, context) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const errorSheet = ss.getSheetByName('Errors');
    
    const userData = Session.getActiveUser().getEmail();
    
    // Attempt to get IP address and browser info (more complex in GAS)
    const ipAddress = 'N/A';
    const browser = 'N/A';
    
    errorSheet.appendRow([
      new Date().toISOString(),
      error.message,
      error.stack || 'No stack trace',
      functionName,
      JSON.stringify(context),
      ipAddress,
      browser
    ]);
  } catch (e) {
    Logger.log('Error logging failed: ' + e);
  }
}

setupErrorTracking();