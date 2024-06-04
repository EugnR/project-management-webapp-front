function buildBoard() {
    // Найти элемент с классом board
    const board = document.querySelector('.board');
    params = getQueryParams();
    fetch(`http://localhost:8080/api/v1/getStatusesByProjectId/${params['projectid']}`, {
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
        statusesList = data;
        console.log(statusesList);
        // const tbody = document.querySelector('tbody');
        // tbody.innerHTML = ''; // Очистка содержимого tbody
        // // Проверка, является ли data массивом
        // if (Array.isArray(data)) {
        //     // Заполнение таблицы данными из JSON
        //     data.forEach(project => createRow(project));
        // } else {
        //     console.error('Data is not an array:', data);
        // }
    })
    .catch(error => {
        // console.error('Error fetching projects:', error);
        console.error(error);
    });


function createStatus(name){

}


    if (board) {
        // Проверка, является ли data со статусами массивом
        if (Array.isArray(statusesList)) {
            statusesList.array.forEach(status => {
                
            });
        } else {
            console.error('Data with with statuses is not an array:', data);
        }

        // Создание колонки
        const column = document.createElement('div');
        column.className = 'column';
        column.setAttribute('data-col-pos', '1');
        
        // Создание заголовка колонки
        const columnHeader = document.createElement('div');
        columnHeader.className = 'board-column-header';
        columnHeader.setAttribute('draggable', 'true');
        columnHeader.textContent = 'Запланировано';
        
        // Создание обертки для содержимого колонки
        const columnContentWrapper = document.createElement('div');
        columnContentWrapper.className = 'board-column-content-wrapper';
        
        // Создание элемента задачи
        const boardItem = document.createElement('div');
        boardItem.className = 'board-item';
        boardItem.setAttribute('data-item-id', '1');
        boardItem.setAttribute('data-item-col-id', '1');
        boardItem.setAttribute('draggable', 'true');
        boardItem.setAttribute('onclick', 'createModal()');
        
        // Создание содержимого задачи
        const boardItemContent = document.createElement('div');
        boardItemContent.className = 'board-item-content';
        boardItemContent.textContent = 'Item #1';
        
        // Создание описания задачи
        const boardItemDescription = document.createElement('div');
        boardItemDescription.className = 'board-item-description';
        boardItemDescription.textContent = 'Дополнительное описание задачи';
        
        // Добавление содержимого и описания в элемент задачи
        boardItem.appendChild(boardItemContent);
        boardItem.appendChild(boardItemDescription);
        
        // Добавление элемента задачи в обертку для содержимого колонки
        columnContentWrapper.appendChild(boardItem);
        
        // Добавление заголовка и обертки для содержимого в колонку
        column.appendChild(columnHeader);
        column.appendChild(columnContentWrapper);
        
        // Добавление колонки в элемент board
        board.appendChild(column);
    } else {
        console.error('Элемент с классом .board не найден');
    }
}

