document.addEventListener('DOMContentLoaded', () => {
    const formCheck = document.querySelector('[data-form-check]');
    const form = document.querySelector('[data-form]');

    const submit = () => {
        alert("данные отправлены");
    };

    for (let elem of form.elements) {
        elem.addEventListener('input', () => {
            elem.parentElement.classList.remove('form__field--error-message');
        });
    }

    form.addEventListener('submit', (event)=> {
        event.preventDefault();
        let isValidate = true;

        
        for (let elem of form.elements) {
            if (elem.hasAttribute('data-form-input')) {
                if (elem.value === "") {
                    isValidate = false;
                    elem.parentElement.classList.add('form__field--error-message');
                } else {
                    elem.parentElement.classList.remove('form__field--error-message');
                }
            }
        }

        if (!isValidate) {
            return;
        }
        
        if (formCheck.checked) {
            submit();
            form.reset();
        } else {
            alert('Для отправки формы необходимо согласиться с условиями');
        }
    });
});