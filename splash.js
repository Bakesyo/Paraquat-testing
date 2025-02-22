document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const agreementModal = document.getElementById('agreement-modal');
    const mainContent = document.getElementById('main-content');
    const startButton = document.getElementById('start-evaluation');
    const consentCheckbox = document.getElementById('consent');
    const continueButton = document.getElementById('agree-continue');

    // Debug check
    console.log('Elements found:', {
        splashScreen: !!splashScreen,
        agreementModal: !!agreementModal,
        mainContent: !!mainContent,
        startButton: !!startButton,
        consentCheckbox: !!consentCheckbox,
        continueButton: !!continueButton
    });

    // Splash screen button
    startButton.addEventListener('click', () => {
        splashScreen.style.opacity = '0';
        setTimeout(() => {
            splashScreen.style.display = 'none';
            agreementModal.style.display = 'flex';
            setTimeout(() => {
                agreementModal.style.opacity = '1';
            }, 50);
        }, 300);
    });

    // Agreement checkbox
    consentCheckbox.addEventListener('change', () => {
        continueButton.disabled = !consentCheckbox.checked;
        if (consentCheckbox.checked) {
            continueButton.classList.add('active');
        } else {
            continueButton.classList.remove('active');
        }
    });

    // Continue button
    continueButton.addEventListener('click', () => {
        if (consentCheckbox.checked) {
            agreementModal.style.opacity = '0';
            setTimeout(() => {
                agreementModal.style.display = 'none';
                mainContent.style.display = 'block';
                setTimeout(() => {
                    mainContent.style.opacity = '1';
                }, 50);
            }, 300);
        }
    });
});
