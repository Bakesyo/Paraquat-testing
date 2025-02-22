function mockApiEndpoint(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                // Validation checks
                const requiredFields = ['fullName', 'phone', 'exposureType', 'parkinsonsStatus'];
                const missingFields = requiredFields.filter(field => !formData[field]);
                
                if (missingFields.length > 0) {
                    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
                }

                // Phone number validation
                const phoneRegex = /^[\d\(\)\-\s]+$/;
                if (!phoneRegex.test(formData.phone)) {
                    throw new Error('Invalid phone number format');
                }

                // Signature check
                if (!formData.signature) {
                    throw new Error('Signature is required');
                }

                // Simulate successful submission
                const leadId = 'PQ' + Date.now().toString().slice(-6);
                resolve({
                    success: true,
                    message: 'Form submitted successfully',
                    leadId: leadId,
                    qualificationStatus: formData.parkinsonsStatus === 'Yes' ? 'Qualified' : 'Under Review',
                    nextSteps: {
                        message: 'Our team will contact you within 24 hours',
                        priority: formData.parkinsonsStatus === 'Yes' ? 'High' : 'Normal'
                    }
                });
            } catch (error) {
                reject(error);
            }
        }, 1500); // Simulate network delay
    });
}
