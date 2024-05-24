

function createRegistrationModal() {
    // Создаем элементы модального окна
    var modal = document.createElement("div");
    modal.id = "registerModal";
    modal.className = "modal";

    var modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    var closeButton = document.createElement("span");
    closeButton.className = "close";
    closeButton.innerHTML = "&times;";
    closeButton.onclick = () => { removeDiv(modal.id); }
    modalContent.appendChild(closeButton);

    var modalTitle = document.createElement("h2");
    modalTitle.innerHTML = "Регистрация";
    modalContent.appendChild(modalTitle);

    //var form = document.createElement("form");


    var nameInput = document.createElement("input");
    nameInput.setAttribute("id", "userName");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("placeholder", "Имя пользователя");

    modalContent.appendChild(nameInput);
    modalContent.appendChild(document.createElement("br")); // добавляем перенос строки
    modalContent.appendChild(document.createElement("br")); // добавляем перенос строки


    var emailInput = document.createElement("input");
    emailInput.setAttribute("id", "userEmail");
    emailInput.setAttribute("type", "text");
    emailInput.setAttribute("placeholder", "Email");

    modalContent.appendChild(emailInput);
    modalContent.appendChild(document.createElement("br")); // добавляем перенос строки
    modalContent.appendChild(document.createElement("br")); // добавляем перенос строки


    var passInput = document.createElement("input");
    passInput.setAttribute("id", "userPass");
    passInput.setAttribute("type", "text");
    passInput.setAttribute("placeholder", "Пароль");

    modalContent.appendChild(passInput);
    modalContent.appendChild(document.createElement("br")); // добавляем перенос строки
    modalContent.appendChild(document.createElement("br")); // добавляем перенос строки


    var submitButton = document.createElement("button");
    submitButton.setAttribute("id", "registrationButton")
    submitButton.innerHTML = "Зарегистрироваться";
    // submitButton.setAttribute("value", "Отправить");
    modalContent.appendChild(submitButton);

    // var testButton = document.createElement("button");
    // testButton.innerHTML = "тестовая кнопка";
    // form.appendChild(testButton);



    
    
    // modalContent.appendChild(form);
    modal.appendChild(modalContent);

    // Добавляем модальное окно в документ
    document.body.appendChild(modal);

    // Отображаем модальное окно
    modal.style.display = "block";




    document.getElementById('registrationButton').addEventListener('click', function () {

        const name = document.getElementById("userName").value;
        const email = document.getElementById("userEmail").value;
        const password = document.getElementById("userPass").value;

        const user = {
            name: name,
            email: email,
            password: password
        };

        fetch("http://localhost:8080/example/testpost", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success sending registration data: ', data);
        })
        .catch((error) => {
            console.error('Error while sending registration data: ', error);
        });

        removeDiv(modal.id);
    })


}

function removeDiv() {
    // Находим контейнер
    var container = document.getElementById("registerModal");
    container.remove();
    // Проверяем, есть ли элементы для удаления
    if (container.children.length > 0) {
        // Удаляем последний дочерний элемент (последний добавленный div)
        container.removeChild(container.lastChild);
    } else {

        alert("Нет элементов для удаления!");
    }
}


window.onclick = function (event) {
    var modal = document.getElementById("registerModal");
    if (event.target == modal) {
        modal.remove();
    }
}