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
    nameInput.setAttribute("name", "newTaskName");
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
    descriptionInput.setAttribute("name", "newTaskDesc");
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


    var deleteInput = document.createElement("input");
    deleteInput.className = "deleteModalButton";
    deleteInput.setAttribute("type", "button");
    deleteInput.setAttribute("value", "Удалить задачу");
    deleteInput.onclick = () => {  
        deleteTask(taskId);
        removeDiv(modal.id); 
    };
    form.appendChild(deleteInput);

    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(form);
        
    modal.appendChild(modalContent);

    // Добавляем модальное окно в документ
    document.body.appendChild(modal);

    // Функция для отправки данных формы
    function sendTaskFormData(event) {
        event.preventDefault(); // Предотвращаем обновление страницы

        // Собираем данные формы
        var formData = new FormData(form);

        // Отправляем данные с использованием Fetch API
        fetch(`http://localhost:8080/api/v1/editTask/${taskId}`, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('что-то пошло не так при отправке данных задачи на сервер');
                }
            })
            .then(data => {
                if (data.status == "Success") {
                    console.log("успешно изменено содержимое задачи на сервере");
                } else if (data.status == "fail") {
                    console.log("не удалось изменить содержимое задачи на сервере");
                }

                const redactedTask = document.querySelector(`.board-item[data-task-id = "${taskId}"]`);
                const redactedTaskName = redactedTask.querySelector(`.board-item-content`);
                // Проверка, является ли значение nameInput пустым
                if (nameInput.value.trim() !== "") {
                    redactedTaskName.textContent = `${nameInput.value}`;
                } else {
                    redactedTaskName.textContent = `Без названия`;
                }
                
                const redactedTaskDesc = redactedTask.querySelector(`.board-item-description`);
                // Проверка, является ли значение nameInput пустым
                if (descriptionInput.value.trim() !== "") {
                    redactedTaskDesc.textContent = `${descriptionInput.value}`;
                } else {
                    redactedTaskDesc.textContent = `Нет описания`;
                }
                // redactedTaskDesc.textContent = `${descriptionInput.value}`;
                redactedTask.setAttribute('onclick', `createTaskModal(${taskId}, "${nameInput.value}", "${descriptionInput.value}")`);

                removeDiv(modal.id);
            })
            .catch(error => {
                console.error(error);
            });
    }

    form.addEventListener('submit', sendTaskFormData);

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

window.onclick = function (event) {
    if (event.target.classList.contains("modal")) {
        event.target.remove();
    }
}






