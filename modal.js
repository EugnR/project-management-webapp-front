function createModal() {
    // Создаем элементы модального окна
    var modal = document.createElement("div");
    modal.id = "myModal";
    modal.className = "modal";

    var modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    var closeButton = document.createElement("span");
    closeButton.className = "close";
    closeButton.innerHTML = "&times;";
    closeButton.onclick = removeDiv;

    var modalTitle = document.createElement("h2");
    modalTitle.innerHTML = "Заголовок окна";

    var form = document.createElement("form");

    var nameLabel = document.createElement("label");
    nameLabel.setAttribute("for", "name");
    nameLabel.innerHTML = "Имя:";
    var nameInput = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("id", "name");
    nameInput.setAttribute("name", "name");
    form.appendChild(nameLabel);
    form.appendChild(nameInput);
    form.appendChild(document.createElement("br")); // добавляем перенос строки

    var emailLabel = document.createElement("label");
    emailLabel.setAttribute("for", "email");
    emailLabel.innerHTML = "Email:";
    var emailInput = document.createElement("input");
    emailInput.setAttribute("type", "email");
    emailInput.setAttribute("id", "email");
    emailInput.setAttribute("name", "email");
    form.appendChild(emailLabel);
    form.appendChild(emailInput);
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

function removeDiv() {
    // Находим контейнер
    var container = document.getElementById("myModal");
    container.remove();
    // Проверяем, есть ли элементы для удаления
    if (container.children.length > 0) {
        // Удаляем последний дочерний элемент (последний добавленный div)
        container.removeChild(container.lastChild);
    } else {
        
        alert("Нет элементов для удаления!");
    }
}

window.onclick = function(event) {
    var modal = document.getElementById("myModal");
    if (event.target == modal) {
        modal.remove();
    }
  }