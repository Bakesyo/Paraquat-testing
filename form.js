document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('paraquat-form');
    const steps = form.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');

    // Handle next button clicks
    document.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const currentStepNum = parseInt(currentStep.dataset.step);
            
            // Validate current step
            const fields = currentStep.querySelectorAll('input, select');
            let isValid = true;
            
            fields.forEach(field => {
                if (field.hasAttribute('required') && !field.value) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });

            if (!isValid) {
                alert('Please fill in all required fields.');
                return;
            }

            // Move to next step
            currentStep.classList.remove('active');
            const nextStep = form.querySelector(`[data-step="${currentStepNum + 1}"]`);
            nextStep.classList.add('active');

            // Update progress bar
            progressSteps[currentStepNum - 1].classList.remove('active');
            progressSteps[currentStepNum].classList.add('active');
        });
    });

    // Handle previous button clicks
    document.querySelectorAll('.prev-step').forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const currentStepNum = parseInt(currentStep.dataset.step);
            
            // Move to previous step
            currentStep.classList.remove('active');
            const prevStep = form.querySelector(`[data-step="${currentStepNum - 1}"]`);
            prevStep.classList.add('active');

            // Update progress bar
            progressSteps[currentStepNum - 1].classList.remove('active');
            progressSteps[currentStepNum - 2].classList.add('active');
        });
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect all form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // You can replace this with your actual form submission logic
        console.log('Form data:', data);

        alert('Thank you for submitting your information. We will contact you soon.');
    });
});
