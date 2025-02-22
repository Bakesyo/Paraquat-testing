let signaturePad;

function initializeSignaturePad() {
    const canvas = document.getElementById('signaturePad');
    const container = canvas.parentElement;

    // Set canvas size based on container
    function resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
    }

    // Call once to set initial size
    resizeCanvas();

    // Initialize SignaturePad
    signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 32)',
        minWidth: 2,
        maxWidth: 4,
        throttle: 16, // Increase performance
        velocityFilterWeight: 0.7
    });

    // Handle window resize
    window.addEventListener('resize', resizeCanvas);

    // Clear signature button
    document.getElementById('clearSignature').addEventListener('click', () => {
        signaturePad.clear();
    });

    // Redo signature button
    document.getElementById('redoSignature').addEventListener('click', () => {
        signaturePad.clear();
        alert('Please sign again');
    });

    // Handle touch devices
    let isDrawing = false;

    canvas.addEventListener('touchstart', function(e) {
        isDrawing = true;
        e.preventDefault();
    }, { passive: false });

    canvas.addEventListener('touchend', function() {
        isDrawing = false;
    });

    canvas.addEventListener('touchmove', function(e) {
        if (!isDrawing) return;
        e.preventDefault();
    }, { passive: false });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeSignaturePad);

// Export for use in main form
window.getSignatureData = function() {
    return signaturePad ? signaturePad.toDataURL() : null;
};

window.isSignatureEmpty = function() {
    return signaturePad ? signaturePad.isEmpty() : true;
};
