function saveFormState() {
    const form = document.getElementById('lead-form');
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    localStorage.setItem('formState', JSON.stringify(data));
}

function loadFormState() {
    const savedState = localStorage.getItem('formState');
    if (savedState) {
        const data = JSON.parse(savedState);
        Object.keys(data).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = data[key];
            }
        });
    }
}

function clearFormState() {
    localStorage.removeItem('formState');
}
