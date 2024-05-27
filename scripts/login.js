document.getElementById('enterButton').addEventListener('click', function () {

    let requiredFields = document.querySelectorAll('.required-login');
    let allFieldsFilled = true;

    // Проверяем каждое поле на наличие значения
    requiredFields.forEach(function (field) {

        if (!field.value.trim()) {
            allFieldsFilled = false;
            field.style.border = '2px solid red';  // Подсветка незаполненного поля
        } else {

            field.style.border = '';  // Убираем подсветку, если поле заполнено
        }
    });

    // Если не все поля заполнены, предотвращаем отправку формы и показываем сообщение
    if (!allFieldsFilled) {
        alert('Пожалуйста, заполните все обязательные поля.');
        // event.preventDefault();
        return;

    }




    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    const formData = {
        "name": login,
        "password": password,
    };

    fetch("http://localhost:8080/api/v1/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // console.log(response.json());
            return response.json();
        })
        .then(data => {
            // Handle successful response from server
            console.log(data.status);
            console.log(data.id);

            if (data.status == "Success") {
                // Перенаправление на clients_page.html при успешной аутентификации
                sessionStorage.setItem('userId', data.userId)
                window.location.href = 'projects.html';
            } else {
                alert('Неправильный логин или пароль!');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

})