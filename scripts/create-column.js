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
        column.dataset.colId = newColumnIndex;


        // Находим все элементы класса board-item внутри текущей колонки
        var items = column.querySelectorAll('.board-item');


        // Проходим по каждому элементу board-item
        items.forEach(function (item) {
            // Устанавливаем заново значение атрибута data-item-col-num-id у каждого элемента 
            if (!item.classList.contains("emptySectionHiddenLesson")) {
                item.dataset.itemColId = column.dataset.colId;
            }
            else {
                item.onclick = function () { createTask(column.dataset.colId); }
            }
        });
        newColumnIndex += 1;





    });


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

window.addEventListener("load", () => {
    for (const draggableElement of document.querySelectorAll(
        ".board-column-header"
    )) {
        draggableElement.onmousedown = onMouseDownColumn;
        draggableElement.ondragstart = () => {
            return false;
        };
    }
});





function createColumn() {
    var board = document.querySelector(".board");
    var numOfColumns = document.querySelectorAll(".column").length;


    // Создание основного элемента <div class="column" data-col-id="3">
    var columnDiv = document.createElement("div");
    columnDiv.classList.add("column");
    columnDiv.setAttribute("data-col-pos", numOfColumns + 1);

    // Создание заголовка <div class="board-column-header" draggable>Third column</div>
    var headerDiv = document.createElement("div");
    headerDiv.classList.add("board-column-header");
    headerDiv.setAttribute("draggable", true);
    headerDiv.textContent = "New column";

    // Создание блока-кнопки для удаления столбца

    // Создание контейнера для содержимого <div class="board-column-content-wrapper">
    var contentWrapperDiv = document.createElement("div");
    contentWrapperDiv.classList.add("board-column-content-wrapper");

    // Добавление заголовка и контейнера для содержимого в основной элемент <div class="column">
    columnDiv.appendChild(headerDiv);
    columnDiv.appendChild(contentWrapperDiv);

    // Назначаем обработчики событий на новый элемент               //СКОРЕЕ ВСЕГО ПРОСЛУШИВАТЕЛЬ ДОЛЖЕН БЫТЬ НЕ НА CLOUMN А НА HEADER
    headerDiv.onmousedown = onMouseDownColumn;
    headerDiv.ondragstart = () => {
        return false;
    };

    // Добавление созданного блока в DOM
    board.appendChild(columnDiv);



    processEmptySections();
}