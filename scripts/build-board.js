// let statusesList = [];
// let tasksList = [];

document.addEventListener('DOMContentLoaded', (event) => {
    buildBoard();
});


function buildBoard() {
    const board = document.querySelector('.board');
    const params = getQueryParams();
    let statusesList = [];
    let tasksList = [];

    if (!board) {
        console.error('Элемент с классом .board не найден');
        return;
    }

    fetch(`http://localhost:8080/api/v1/getStatusesByProjectId/${params['projectid']}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response while getting statuses was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            statusesList = data;

            // Сортируем statusesList по ключу position
            statusesList.sort((a, b) => a.position - b.position);
            console.log("Отсортированные статусы: ", statusesList);

            if (!Array.isArray(statusesList)) {
                console.error('Data with statuses is not an array:', statusesList);
                return;
            }

            // Создаем все колонки сразу
            statusesList.forEach(status => {
                const column = document.createElement('div');
                column.className = 'column';
                column.setAttribute('data-col-pos', `${status.position}`);
                column.setAttribute('data-col-id', `${status.id}`);

                const columnHeaderWrapper = document.createElement('div');
                columnHeaderWrapper.className = 'board-column-header-wrapper';

                const trashBin = document.createElement('img');
                trashBin.src = 'images/trashbin.svg';
                trashBin.className = 'board-column-deleter-img';

                const columnHeader = document.createElement('div');
                columnHeader.className = 'board-column-header';
                columnHeader.setAttribute('draggable', 'true');
                columnHeader.textContent = `${status.name}`;

                const columnDeleter = document.createElement('div');
                columnDeleter.setAttribute("onclick", `deleteColumn(${status.id})`);
                columnDeleter.className = 'board-column-deleter';

                columnDeleter.appendChild(trashBin);
                columnHeaderWrapper.appendChild(columnHeader);
                columnHeaderWrapper.appendChild(columnDeleter);
                column.appendChild(columnHeaderWrapper);

                const columnContentWrapper = document.createElement('div');
                columnContentWrapper.className = 'board-column-content-wrapper';
                column.appendChild(columnContentWrapper);

                board.appendChild(column);
            });

            // Асинхронно заполняем задачи для каждой колонки
            const fetchTasksPromises = statusesList.map(status => {
                return fetch(`http://localhost:8080/api/v1/getTasksByStatusId/${status.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response while getting tasks for status was not ok ' + response.statusText);
                        }
                        return response.json();
                    })
                    .then(data => {
                        tasksList = data;

                        if (!Array.isArray(tasksList)) {
                            console.error('Data with tasks is not an array:', tasksList);
                            return;
                        }

                        // Найти соответствующую колонку
                        const column = board.querySelector(`.column[data-col-pos="${status.position}"] .board-column-content-wrapper`);
                        if (column) {
                            tasksList.forEach(task => {
                                const boardItem = document.createElement('div');
                                boardItem.className = 'board-item';
                                boardItem.setAttribute('data-task-pos', task.position);
                                boardItem.setAttribute('data-task-col-num', status.position);
                                boardItem.setAttribute('draggable', 'true');
                                boardItem.setAttribute('onclick', 'createModal()');

                                const boardItemContent = document.createElement('div');
                                boardItemContent.className = 'board-item-content';
                                boardItemContent.textContent = `${task.name}`;

                                const boardItemDescription = document.createElement('div');
                                boardItemDescription.className = 'board-item-description';
                                boardItemDescription.textContent = `${task.description}`;

                                boardItem.appendChild(boardItemContent);
                                boardItem.appendChild(boardItemDescription);

                                column.appendChild(boardItem);
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Ошибка при фетчинге задач проекта:', error);
                    });
            });

            return Promise.all(fetchTasksPromises);
        })
        .then(() => {
            let tempArr = document.querySelectorAll(".board-column-header");
            console.log("board-column-header созданные в buildBoard: ", tempArr);
            initDNDforColumns();
            initDNDforItems();
        })
        .catch(error => {
            console.error('Error fetching statuses:', error);
        });
}

//работает, но столбцы в случайном попрядке
// function buildBoard() {
//     // Найти элемент с классом board
//     const board = document.querySelector('.board');
//     const params = getQueryParams();
//     let statusesList = [];
//     let tasksList = [];

//     if (!board) {
//         console.error('Элемент с классом .board не найден');
//         return;
//     }

//     fetch(`http://localhost:8080/api/v1/getStatusesByProjectId/${params['projectid']}`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json;charset=utf-8'
//         }
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response while getting statuses was not ok ' + response.statusText);
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log("Полученные с бэка статусы: ", data);
//             statusesList = data; // Сохраняем статусы
            
//             // // Сортировка по ключу position      НЕ ПОМОГАЕТ
//             // statusesList = data.sort((a, b) => a.position - b.position);
//             // console.log("Отсортированные статусы: ", statusesList);

//             if (!Array.isArray(statusesList)) {
//                 console.error('Data with statuses is not an array:', statusesList);
//                 return;
//             }

//             const fetchTasksPromises = statusesList.map(status => {
//                 // Создание колонки
//                 const column = document.createElement('div');
//                 column.className = 'column';
//                 column.setAttribute('data-col-pos', `${status.position}`);

//                 // Создание обёртки для заголовка колонки
//                 const columnHeaderWrapper = document.createElement('div');
//                 columnHeaderWrapper.className = 'board-column-header-wrapper';

//                 //создание картинки внутри обёртки
//                 const trashBin = document.createElement('img');
//                 trashBin.src = 'images/trashbin.svg';
//                 trashBin.className = 'board-column-deleter-img';

//                 // Создание заголовка колонки
//                 const columnHeader = document.createElement('div');
//                 columnHeader.className = 'board-column-header';
//                 columnHeader.setAttribute('draggable', 'true');
//                 columnHeader.textContent = `${status.name}`;

//                 // Создание кнопки для удаления колонки
//                 const columnDeleter = document.createElement('div');
//                 // columnDeleter.onclick = function() {deleteColumn(status.id);};
//                 columnDeleter.setAttribute("onclick", `deleteColumn(${status.id})`);
//                 columnDeleter.className = 'board-column-deleter';

//                 // Добавление заголовка в колонку
//                 columnDeleter.appendChild(trashBin);
//                 columnHeaderWrapper.appendChild(columnHeader);
//                 columnHeaderWrapper.appendChild(columnDeleter);
//                 column.appendChild(columnHeaderWrapper);

//                 // Создание обертки для содержимого колонки
//                 const columnContentWrapper = document.createElement('div');
//                 columnContentWrapper.className = 'board-column-content-wrapper';



//                 return fetch(`http://localhost:8080/api/v1/getTasksByStatusId/${status.id}`, {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json;charset=utf-8'
//                     }
//                 })
//                     .then(response => {
//                         if (!response.ok) {
//                             throw new Error('Network response while getting tasks for status was not ok ' + response.statusText);
//                         }
//                         return response.json();
//                     })
//                     .then(data => {
//                         console.log(data);
//                         tasksList = data; // Сохраняем задачи
//                         console.log(tasksList);

//                         if (!Array.isArray(tasksList)) {
//                             console.error('Data with tasks is not an array:', tasksList);
//                             return;
//                         }

//                         // Заполнение таблицы данными из JSON
//                         tasksList.forEach(task => {
//                             // Создание элемента задачи
//                             const boardItem = document.createElement('div');
//                             boardItem.className = 'board-item';
//                             boardItem.setAttribute('data-task-pos', task.position);
//                             boardItem.setAttribute('data-task-col-num', status.position);
//                             boardItem.setAttribute('draggable', 'true');
//                             boardItem.setAttribute('onclick', 'createModal()');

//                             // Создание содержимого задачи
//                             const boardItemContent = document.createElement('div');
//                             boardItemContent.className = 'board-item-content';
//                             boardItemContent.textContent = `${task.name}`;

//                             // Создание описания задачи
//                             const boardItemDescription = document.createElement('div');
//                             boardItemDescription.className = 'board-item-description';
//                             boardItemDescription.textContent = `${task.description}`;

//                             // Добавление содержимого и описания в элемент задачи
//                             boardItem.appendChild(boardItemContent);
//                             boardItem.appendChild(boardItemDescription);

//                             // Добавление элемента задачи в обертку для содержимого колонки
//                             columnContentWrapper.appendChild(boardItem);
//                         });

//                         // Добавление обертки для содержимого в колонку
//                         column.appendChild(columnContentWrapper);

//                         // Добавление колонки в элемент board
//                         board.appendChild(column);
//                     })
//                     .catch(error => {
//                         console.error('Ошибка при фетчинге задач проекта:', error);
//                     });
//             });

//             // Используем Promise.all чтобы дождаться завершения всех fetch запросов
//             return Promise.all(fetchTasksPromises);
//         })
//         .then(() => {
//             // Проверка наличия созданных элементов после завершения всех асинхронных операций
//             let tempArr = document.querySelectorAll(".board-column-header");
//             console.log("board-column-header созданные в buildBoard: ", tempArr);
//             initDNDforColumns();
//             initDNDforItems();
//         })
//         .catch(error => {
//             console.error('Error fetching statuses:', error);
//         });
// }


// function buildBoard() {
//     // Найти элемент с классом board
//     const board = document.querySelector('.board');
//     const params = getQueryParams();

//     fetch(`http://localhost:8080/api/v1/getStatusesByProjectId/${params['projectid']}`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json;charset=utf-8'
//         }
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response while getting statuses was not ok ' + response.statusText);
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log("Полученные с бэка статусы: ", data);
//             data.forEach(objItem => {
//                 statusesList.push(objItem);
//             });
//             // statusesList = data;
//             console.log("Далее статусы будут обрабатываться в таком виде: ", statusesList);

//             if (board) {
//                 // Проверка, является ли data со статусами массивом
//                 if (Array.isArray(statusesList)) {
//                     // statusesList.array.forEach(status => {
//                     statusesList.forEach(status => {
//                         // Создание колонки
//                         const column = document.createElement('div');
//                         column.className = 'column';
//                         column.setAttribute('data-col-pos', `${status.position}`);

//                         // Создание заголовка колонки
//                         const columnHeader = document.createElement('div');
//                         columnHeader.className = 'board-column-header';
//                         columnHeader.setAttribute('draggable', 'true');
//                         columnHeader.textContent = `${status.name}`;

//                         // Добавление заголовка в колонку
//                         column.appendChild(columnHeader);

//                         // Создание обертки для содержимого колонки
//                         const columnContentWrapper = document.createElement('div');
//                         columnContentWrapper.className = 'board-column-content-wrapper';


//                         //запросом получаем все задачи в статусе
//                         fetch(`http://localhost:8080/api/v1/getTasksByStatusId/${status.id}`, {
//                             method: 'GET',
//                             headers: {
//                                 'Content-Type': 'application/json;charset=utf-8'
//                             }
//                         })
//                             .then(response => {
//                                 if (!response.ok) {
//                                     throw new Error('Network response while getting tasks for status was not ok ' + response.statusText);
//                                 }
//                                 return response.json();
//                             })
//                             .then(data => {
//                                 console.log(`задачи статуса ${status.name}: `, data);
//                                 tasksList = data;
//                                 console.log(`задачи статуса ${status.name} далее обрабатываются в таком виде: `, tasksList);

//                                 if (Array.isArray(tasksList)) {
//                                     // Заполнение таблицы данными из JSON
//                                     tasksList.forEach(task => {
//                                         // Создание элемента задачи
//                                         const boardItem = document.createElement('div');
//                                         boardItem.className = 'board-item';
//                                         boardItem.setAttribute('task-pos', '1');
//                                         boardItem.setAttribute('task-col-num', '1');
//                                         boardItem.setAttribute('draggable', 'true');
//                                         boardItem.setAttribute('onclick', 'createModal()');

//                                         // Создание содержимого задачи
//                                         const boardItemContent = document.createElement('div');
//                                         boardItemContent.className = 'board-item-content';
//                                         boardItemContent.textContent = `${task.name}`;

//                                         // Создание описания задачи
//                                         const boardItemDescription = document.createElement('div');
//                                         boardItemDescription.className = 'board-item-description';
//                                         boardItemDescription.textContent = `${task.description}`;

//                                         // Добавление содержимого и описания в элемент задачи
//                                         boardItem.appendChild(boardItemContent);
//                                         boardItem.appendChild(boardItemDescription);

//                                         // Добавление элемента задачи в обертку для содержимого колонки
//                                         columnContentWrapper.appendChild(boardItem);
//                                     });

//                                     // Добавление обертки для содержимого в колонку
//                                     column.appendChild(columnContentWrapper);

//                                 } else {
//                                     console.error('Data with tasks is not an array:', tasksList);
//                                 }

//                                 // Добавление колонки в элемент board
//                                 board.appendChild(column);

//                             })
//                             .catch(error => {
//                                 console.error('Ошибка при фетчинге задач проекта:', error);
//                                 // console.error(error);
//                             });
//                     });
//                 } else {
//                     console.error('Data with with statuses is not an array:', statusesList);
//                 }
//                 // // Создание колонки
//                 // const column = document.createElement('div');
//                 // column.className = 'column';
//                 // column.setAttribute('data-col-pos', '1');

//                 // // Создание заголовка колонки
//                 // const columnHeader = document.createElement('div');
//                 // columnHeader.className = 'board-column-header';
//                 // columnHeader.setAttribute('draggable', 'true');
//                 // columnHeader.textContent = 'Запланировано';

//                 // // Создание обертки для содержимого колонки
//                 // const columnContentWrapper = document.createElement('div');
//                 // columnContentWrapper.className = 'board-column-content-wrapper';

//                 // // Создание элемента задачи
//                 // const boardItem = document.createElement('div');
//                 // boardItem.className = 'board-item';
//                 // boardItem.setAttribute('task-pos', '1');
//                 // boardItem.setAttribute('task-col-num', '1');
//                 // boardItem.setAttribute('draggable', 'true');
//                 // boardItem.setAttribute('onclick', 'createModal()');

//                 // // Создание содержимого задачи
//                 // const boardItemContent = document.createElement('div');
//                 // boardItemContent.className = 'board-item-content';
//                 // boardItemContent.textContent = 'Item #1';

//                 // // Создание описания задачи
//                 // const boardItemDescription = document.createElement('div');
//                 // boardItemDescription.className = 'board-item-description';
//                 // boardItemDescription.textContent = 'Дополнительное описание задачи';

//                 // // Добавление содержимого и описания в элемент задачи
//                 // boardItem.appendChild(boardItemContent);
//                 // boardItem.appendChild(boardItemDescription);

//                 // // Добавление элемента задачи в обертку для содержимого колонки
//                 // columnContentWrapper.appendChild(boardItem);

//                 // // Добавление заголовка и обертки для содержимого в колонку
//                 // column.appendChild(columnHeader);
//                 // column.appendChild(columnContentWrapper);

//                 // // Добавление колонки в элемент board
//                 // board.appendChild(column);
//             } else {
//                 console.error('Элемент с классом .board не найден');
//             }


//         })
//         .catch(error => {
//             // console.error('Error fetching projects:', error);
//             console.error(error);
//         });




//     // console.log("Статусы вышли из фетча в таком виде: ", statusesList);


// }


function createStatus(name) {

}
