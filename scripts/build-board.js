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
                columnHeader.setAttribute('onclick', `createStatusModal(${status.id}, '${status.name}')`);

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
                                boardItem.setAttribute('onclick', 'createTaskModal()');

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


