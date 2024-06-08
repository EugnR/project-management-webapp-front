function createTaskModal(taskId, taskName, taskDesc) {
    // Создаем элементы модального окна
    var modal = document.createElement("div");
    modal.id = "taskModal";
    modal.className = "modal";

    var modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    var closeButton = document.createElement("span");
    closeButton.className = "close";
    closeButton.innerHTML = "&times;";
    closeButton.onclick = () => { removeDiv(modal.id); }

    var modalTitle = document.createElement("h2");
    modalTitle.innerHTML = `Задача ${taskId}`;

    var form = document.createElement("form");


    var nameInput = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("placeholder", "Название задачи");
    nameInput.setAttribute("value", `${taskName}`);


    form.appendChild(nameInput);
    form.appendChild(document.createElement("br")); // добавляем перенос строки
    form.appendChild(document.createElement("br")); // добавляем перенос строки

    // var taskTags = document.createElement("div");
    // taskTags.innerHTML = "тут должен быть выбор тэгов как в kaiten c выпадающим списком"
    // form.appendChild(taskTags);

    // form.appendChild(document.createElement("br")); // добавляем перенос строки
    // form.appendChild(document.createElement("br")); // добавляем перенос строки


    var descriptionInput = document.createElement("textarea");
    descriptionInput.setAttribute("placeholder", "Описание задачи");
    // descriptionInput.setAttribute("value", `${taskDesc}`);
    descriptionInput.textContent = taskDesc;

    form.appendChild(descriptionInput);
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

    // Отображаем модальное окно
    modal.style.display = "block";
}

function removeDiv(blockName) {
    // Находим контейнер
    // var container = document.getElementById("taskModal");
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









// window.onclick = function (event) {
//     var modal = document.getElementById("taskModal");
//     if (event.target == modal) {
//         modal.remove();
//     }
// }

window.onclick = function(event) {
    if (event.target.classList.contains("modal")) {
        event.target.remove();
    }
}






