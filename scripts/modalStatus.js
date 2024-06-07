function createStatusModal(statusId, statusName) {
    // Создаем элементы модального окна
    var modal = document.createElement("div");
    modal.id = "statusModal";
    modal.className = "modal";

    var modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    var closeButton = document.createElement("span");
    closeButton.className = "close";
    closeButton.innerHTML = "&times;";
    closeButton.onclick = () => { removeDiv(modal.id); }

    var modalTitle = document.createElement("h2");
    modalTitle.innerHTML = `Редактировать статус ${statusId}`;

    var form = document.createElement("form");
    // form.setAttribute("action", `http://localhost:8080/api/v1/editStatusName/${statusId}`);
    // form.setAttribute('method', 'POST');


    var nameInput = document.createElement("input");
    nameInput.setAttribute("name", "newStatusName");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("placeholder", `Новое имя вместо "${statusName}"`);
    form.appendChild(nameInput);


    form.appendChild(document.createElement("br")); // добавляем перенос строки
    form.appendChild(document.createElement("br")); // добавляем перенос строки

    var submitInput = document.createElement("input");
    submitInput.setAttribute("type", "submit");
    submitInput.setAttribute("value", "Сохранить");
    form.appendChild(submitInput);

    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(form);
    modal.appendChild(modalContent);

    // Добавляем модальное окно в документ
    document.body.appendChild(modal);

    // Функция для отправки данных формы
    function sendFormData(event) {
        event.preventDefault(); // Предотвращаем обновление страницы

        // Собираем данные формы
        var formData = new FormData(form);

        // Отправляем данные с использованием Fetch API
        fetch(`http://localhost:8080/api/v1/editStatusName/${statusId}`, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('что-то пошло не так при отправке нового имени статуса на сервер');
                }
            })
            .then(data => {
                if (data.status == "Success") {
                    console.log("успешно изменено имя статуса на сервере");
                } else if (data.status == "fail") {
                    console.log("не удалось изменить имя статуса на сервере");
                }
                const col = document.querySelector(`.column[data-col-id = "${statusId}"]`);
                const header = col.querySelector(`.board-column-header`);
                header.textContent= `${nameInput.value}`;
                removeDiv(modal.id);
            })  
            .catch(error => {
                console.error(error);
            });
    }
    // Назначаем функцию на событие submit формы
    form.addEventListener('submit', sendFormData);

    // Отображаем модальное окно
    modal.style.display = "block";
}



function removeDiv(blockName) {
    // Находим контейнер
    // var container = document.getElementById("statusModal");
    var container = document.getElementById(`${blockName}`);
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
    var modal = document.getElementById("statusModal");
    if (event.target == modal) {
        modal.remove();
    }
}






