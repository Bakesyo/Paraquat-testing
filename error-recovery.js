function setupErrorRecovery() {
    window.addEventListener('error', function(event) {
        const errorData = {
            message: event.error.message,
            stack: event.error.stack,
            timestamp: new Date().toISOString(),
            formData: localStorage.getItem('formState')
        };
        
        // Save error state
        localStorage.setItem('errorState', JSON.stringify(errorData));
        
        // Attempt recovery
        recoverFromError();
    });
}

function recoverFromError() {
    const currentStep = document.querySelector('.form-step.active');
    if (currentStep) {
        // Save current progress
        saveFormState();
        
        // Reload form and restore state
        location.reload();
    }
}
