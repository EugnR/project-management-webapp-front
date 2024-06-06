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


    var nameInput = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("placeholder", `${statusName}`);

    form.appendChild(nameInput);
    form.appendChild(document.createElement("br")); // добавляем перенос строки
    form.appendChild(document.createElement("br")); // добавляем перенос строки


    var descriptionInput = document.createElement("textarea");
    descriptionInput.setAttribute("placeholder", "Описание задачи");

    form.appendChild(descriptionInput);
    form.appendChild(document.createElement("br")); // добавляем перенос строки
    form.appendChild(document.createElement("br")); // добавляем перенос строки

    var submitInput = document.createElement("input");
    submitInput.setAttribute("type", "submit");
    submitInput.setAttribute("value", "Отправить");
    form.appendChild(submitInput);

    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(form);
    modal.appendChild(modalContent);

    // Добавляем модальное окно в документ
    document.body.appendChild(modal);

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






