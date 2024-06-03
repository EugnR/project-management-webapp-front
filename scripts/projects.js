// ПОТОМ УДАЛИТЬ

document.addEventListener('DOMContentLoaded', (event) => {
    loadProjects();
});

function loadProjects() {
    const userId = sessionStorage.getItem('userId');
    fetch(`http://localhost:8080/api/v1/getProjectsByUserId/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = ''; // Очистка содержимого tbody
        // Проверка, является ли data массивом
        if (Array.isArray(data)) {
            // Заполнение таблицы данными из JSON
            data.forEach(project => createRow(project));
        } else {
            console.error('Data is not an array:', data);
        }
    })
    .catch(error => {
        // console.error('Error fetching projects:', error);
        console.error(error);
    });
}

function createRow(project) {
    const tbody = document.querySelector('#projectTable tbody');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${project.id}</td>
        <td><span class="to-tasks" onclick='window.location.href="tasks.1html?project=${project.id}"'>${project.name}</span></td>
        
        <td><span class="delete-link" onclick="deleteRow(this)" >Удалить</span></td>
    `;

    // <td>${project.name}</td>
    /* <td><span class="to-tasks" href="index.html?project=${project.id}">${project.name}</span></td> */
    // <button onclick="window.location.href='page2.html';">Перейти на страницу 2</button>


    tbody.appendChild(row);
}

function deleteRow(element) {
    const row = element.parentNode.parentNode;          //строка tr, в которой находится кнопка
    const projectId = row.querySelector('td').textContent;
    console.log("Id удаляемого проекта в ячейке: ", row.querySelector('td'));
    // row.parentNode.removeChild(row);                    //таблица tbody, в которой находится строка



    fetch(`http://localhost:8080/api/v1/projectDelete/${projectId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
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
                //строка проекта удаляется из таблицы
                row.parentNode.removeChild(row);

            } else {
                throw new Error('Project deletion went unsuccsessfull');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

}






function createProjectModal() {
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
    modalTitle.innerHTML = "Создание проекта";
    modalContent.appendChild(modalTitle);


    var projectNameInput = document.createElement("input");
    projectNameInput.setAttribute("id", "projectName");
    projectNameInput.setAttribute("class", "required-field");
    projectNameInput.setAttribute("type", "text");
    projectNameInput.setAttribute("placeholder", "Название проекта");

    modalContent.appendChild(projectNameInput);
    modalContent.appendChild(document.createElement("br")); // добавляем перенос строки
    modalContent.appendChild(document.createElement("br")); // добавляем перенос строки

    var submitButton = document.createElement("button");
    submitButton.setAttribute("id", "createProjectButton")
    submitButton.innerHTML = "Создать";
    modalContent.appendChild(submitButton);


    modal.appendChild(modalContent);

    // Добавляем модальное окно в документ
    document.body.appendChild(modal);

    // Отображаем модальное окно
    modal.style.display = "block";




    document.getElementById('createProjectButton').addEventListener('click', function () {

        let requiredFields = document.querySelectorAll('.required-field');
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




        const projectName = document.getElementById("projectName").value;
        const projectUser = sessionStorage.getItem('userId');

        const project = {
            name: projectName,
            user: projectUser
        };

        fetch("http://localhost:8080/api/v1/projectCreate", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(project)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                response.json();
            })
            .then(data => {
                console.log('Success sending project data: ', data);
                alert('Проект создан!');
            })
            .catch((error) => {
                console.error('Error while sending registration data: ', error);
                alert('Что-то пошло не так. Проект не создан.');
                return;
            });

        removeDiv(modal.id);
        loadProjects();
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





























// // Пример JSON данных пользователей, полученных с бэкенда
// const users = [
//     { id: 1, username: 'JohnDoe', email: 'john@example.com' },
//     { id: 2, username: 'JaneDoe', email: 'jane@example.com' }
//     // Можно добавить больше пользователей здесь
// ];

// // Функция для создания строки таблицы
// function createRow(user) {
//     const tbody = document.querySelector('#userTable tbody');
//     const row = document.createElement('tr');

//     row.innerHTML = `
//         <td>${user.id}</td>
//         <td>${user.username}</td>
//         <td>${user.email}</td>
//         <td><span class="delete-link" onclick="deleteRow(this)">Удалить</span></td>
//     `;

//     tbody.appendChild(row);
// }

// // Заполнение таблицы данными из JSON
// users.forEach(user => createRow(user));

// // Функция для удаления строки
// function deleteRow(element) {
//     const row = element.parentNode.parentNode;
//     row.parentNode.removeChild(row);
// }