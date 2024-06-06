
let currentDroppableColumn = null;
let columnPlaceholder;
let isColumnDraggingStarted = false;
let movingElementColumn;
let initialColumnHeight;

const createColumnPlaceholder = () => {
    const movingElementHeight = movingElementColumn.getBoundingClientRect().height;
    columnPlaceholder = document.createElement("div");
    columnPlaceholder.classList.add("placeholder-column");
    columnPlaceholder.style.height = movingElementHeight;
    movingElementColumn.parentNode.insertBefore(columnPlaceholder, movingElementColumn);
};

const onMouseMoveColumn = (event) => {
    if (!isColumnDraggingStarted) {
        isColumnDraggingStarted = true;
        createColumnPlaceholder();
        Object.assign(movingElementColumn.style, {
            position: "absolute",
            zIndex: 1000,
            left: `${initialMovingElementPageXY.x}px`,
            top: `${initialMovingElementPageXY.y}px`,
        });
    }
    movingElementColumn.style.height = initialColumnHeight;
    moveAt(movingElementColumn, event.pageX, event.pageY);

    elementBelow = getElementBelow(movingElementColumn, "by-top");
    if (!elementBelow) return;
    let droppableBelow = elementBelow.closest(".column");
    if (currentDroppableColumn != droppableBelow) {
        currentDroppableColumn = droppableBelow;
        if (currentDroppableColumn) {
            if (!isRight(movingElementColumn, currentDroppableColumn)) {
                currentDroppableColumn.parentNode.insertBefore(
                    columnPlaceholder,
                    currentDroppableColumn
                );
            } else {
                currentDroppableColumn.parentNode.insertBefore(
                    columnPlaceholder,
                    currentDroppableColumn.nextElementSibling
                );
            }
        }
    }


};

const setMovingElementColumn = (event) => {
    movingElementColumn = event.target.closest(".column");
};

const onMouseUpColumn = () => {
    if (!isColumnDraggingStarted) {
        document.removeEventListener("mousemove", onMouseMoveColumn);
        movingElementColumn.onmouseup = null;
        return;
    }
    console.log(
        "We move section",
        movingElementColumn,
        "before section",
        columnPlaceholder.nextElementSibling,
        "after section",
        columnPlaceholder.previousElementSibling
    );

    columnPlaceholder.parentNode.insertBefore(movingElementColumn, columnPlaceholder);
    Object.assign(movingElementColumn.style, {
        position: "static",
        left: "auto",
        top: "auto",
        zIndex: "auto",
        transform: "none",
    });
    document.removeEventListener("mousemove", onMouseMoveColumn);
    isColumnDraggingStarted = false;
    columnPlaceholder && columnPlaceholder.parentNode.removeChild(columnPlaceholder);

    //логика изменения индексов колонок

    // Находим все элементы класса column
    var columns = document.querySelectorAll('.column');
    var newColumnIndex = 1;
    // Проходим по каждому элементу column
    columns.forEach(function (column) {
        column.dataset.colPos = newColumnIndex;
        // Находим все элементы класса board-item внутри текущей колонки
        var items = column.querySelectorAll('.board-item');
        // Проходим по каждому элементу board-item
        items.forEach(function (item) {
            // Устанавливаем заново значение атрибута task-col-num у каждого элемента 
            if (!item.classList.contains("emptySectionHiddenLesson")) {
                item.dataset.taskColNum = column.dataset.colPos;
            }
            else {
                item.onclick = function () { createTask(column.dataset.colPos); }
            }
        });
        newColumnIndex += 1;
    });
    let isColPosChanged = changeStatusPosition(movingElementColumn.dataset.colId, movingElementColumn.dataset.colPos);
    if (!isColPosChanged){
      return;
    }

    movingElementColumn.onmouseup = null;
    movingElementColumn = null;
};

const onMouseDownColumn = (event) => {
    setMovingElementColumn(event);
    initialColumnHeight = movingElementColumn.getBoundingClientRect().height;
    shifts.set(event.clientX, event.clientY, movingElementColumn);
    initialMovingElementPageXY.set(movingElementColumn);
    document.addEventListener("mousemove", onMouseMoveColumn);
    movingElementColumn.onmouseup = onMouseUpColumn;
};

for (const draggableElement of document.querySelectorAll(
    ".board-column-header"
)) {
    draggableElement.onmousedown = onMouseDownColumn;
    draggableElement.ondragstart = () => {
        return false;
    };
};





function createColumn() {
    //находим досу и количество всех столбцов
    var board = document.querySelector(".board");
    var numOfColumns = document.querySelectorAll(".column").length;


    // Создание основного элемента <div class="column" data-col-pos="3">
    var column = document.createElement("div");
    column.classList.add("column");
    column.setAttribute("data-col-pos", numOfColumns + 1);

    // Создание обёртки для заголовка колонки
    const columnHeaderWrapper = document.createElement('div');
    columnHeaderWrapper.className = 'board-column-header-wrapper';

    //создание картинки внутри обёртки
    const trashBin = document.createElement('img');
    trashBin.src = 'images/trashbin.svg';
    trashBin.className = 'board-column-deleter-img';

    // Создание блока-кнопки для удаления колонки
    const columnDeleter = document.createElement('div');

    columnDeleter.className = 'board-column-deleter';

    // Создание заголовка <div class="board-column-header" draggable>Third column</div>
    var columnHeader = document.createElement("div");
    columnHeader.classList.add("board-column-header");
    columnHeader.setAttribute("draggable", true);
    let newColumnName = "New column";
    let newColumnPosition = numOfColumns + 1;
    let newColumnProjectId = getQueryParams().projectid;
    columnHeader.textContent = newColumnName;
    sendStatusToDB(newColumnName, newColumnPosition, newColumnProjectId)
        .then(newStatusId => {
            if (newStatusId !== false) {
                column.setAttribute("data-col-id", newStatusId);
                // columnDeleter.onclick = function () { deleteColumn(newStatusId); };
                columnDeleter.setAttribute("onclick", `deleteColumn(${newStatusId})`);
            } else {
                alert("Не удалось создать новый статус");
                return;
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            alert("Не удалось создать новый статус");
            return;
        });


    columnDeleter.appendChild(trashBin);
    columnHeaderWrapper.appendChild(columnHeader);
    columnHeaderWrapper.appendChild(columnDeleter);
    column.appendChild(columnHeaderWrapper);

    // Создание контейнера для содержимого <div class="board-column-content-wrapper">
    var contentWrapperDiv = document.createElement("div");
    contentWrapperDiv.classList.add("board-column-content-wrapper");

    // Добавление заголовка и контейнера для содержимого в основной элемент <div class="column">
    // columnDiv.appendChild(headerDiv);
    column.appendChild(contentWrapperDiv);

    // Назначаем обработчики событий на новый элемент              
    columnHeader.onmousedown = onMouseDownColumn;
    columnHeader.ondragstart = () => {
        return false;
    };

    // Добавление созданного блока в DOM
    board.appendChild(column);



    processEmptySections();
}




//отправить имя, номер позиции и id проекта
async function sendStatusToDB(statusName, statusPosition, statusProject) {
    try {
        const statusInfo = {
            name: statusName,
            position: statusPosition,
            projectId: statusProject
        };

        const response = await fetch('http://localhost:8080/api/v1/createStatus', {
            method: 'POST', // Метод POST
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(statusInfo) // Преобразование данных в JSON и установка в тело запроса
        });

        if (!response.ok) {
            throw new Error('Сервер не вернул созданный статус ' + response.statusText);
        }

        const returnedStatus = await response.json();
        let statusId = returnedStatus.id
        return statusId;


    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return false;
    }
}






async function deleteColumn(statusId) {
    try {
        let columnToDelete = document.querySelector(`.column[data-col-id="${statusId}"]`);
        if (columnToDelete == null) {
            alert("Удаляемый статус не найден на доске");
            return false;
        }

        const response = await fetch(`http://localhost:8080/api/v1/deleteStatus/${statusId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        });

        const returnedStatus = await response.json();
        if (returnedStatus.status == "Success") {
            console.log('статус удалился на сервере');
            //тут идёт удаление элемента с доски после удаления с сервера
            //нужно добавить переустановку индексов столбцов и задач
            // columnToDelete.remove();



            return true;
        } else if (returnedStatus.status == "fail") {
            alert("Не удалось удалить статус. Сервер не нашёл и не удалил статус");
            return false;
        } else {
            console.log("при удалении статуса что-то пошло совсем не так")
            return false;
        }



    } catch (error) {
        console.error('при обращении на сервер произошла ошибка', error);
        return false;
    }
}

async function changeStatusPosition(colId, newColumnIndex) {
    const response = await fetch(`http://localhost:8080/api/v1/editStatusPosition/${colId}/${newColumnIndex}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })
    const returnedStatus = await response.json();
    if (returnedStatus.status == "Success") {
        console.log('позиция статуса изменилась на сервере');
        return true;
    } else if (returnedStatus.status == "fail") {
        console.log("не удалось изменить позицию статуса на сервере");
        return false;
    } else {
        console.log("при удалении статуса что-то пошло совсем не так")
        return false;
    }

}



