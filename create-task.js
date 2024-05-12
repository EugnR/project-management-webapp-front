{/* <div class="column" data-col-id=1 >
    <div class="board-column-header" draggable>Col_Header</div>
    <div class="board-column-content-wrapper">
        <div class="board-item" data-item-id draggable>
            <div class="board-item-content">Item #11</div>
        </div>
    </div>
</div > */}

let currentDroppable = null;
  let placeholder;
  let isDraggingStarted = false;
  let movingElement;

  const processEmptySections = () => {
    // Create not visible .board-item in empty sections to dnd work with it too
    document
      .querySelectorAll(".board-column-content-wrapper")
      .forEach((section) => {
        if (
          //!section.querySelector(".board-item:not(.emptySectionHiddenLesson)")
          !section.querySelector(".board-item:not(.emptySectionHiddenLesson), .emptySectionHiddenLesson")
        ) {
          const emptySectionHiddenLesson = document.createElement("div");
          emptySectionHiddenLesson.classList.add(
            "board-item",
            "emptySectionHiddenLesson"
          );
          section.append(emptySectionHiddenLesson);
        }
        // else 
        // {
        //   const emptySectionHiddenLesson = section.querySelector(
        //     ".emptySectionHiddenLesson"
        //   );
        //   emptySectionHiddenLesson &&
        //     section.removeChild(emptySectionHiddenLesson);
        // }
      });
  };

  const createPlaceholder = () => {
    // Create and position placeholder before movingElement
    placeholder = document.createElement("div");
    placeholder.classList.add("placeholder");
    movingElement.parentNode.insertBefore(placeholder, movingElement);
  };

  const onMouseMove = (event) => {
    if (!isDraggingStarted) {
      isDraggingStarted = true;
      createPlaceholder();
      Object.assign(movingElement.style, {
        position: "absolute",
        zIndex: 1000,
        left: `${initialMovingElementPageXY.x}px`,
        top: `${initialMovingElementPageXY.y}px`,
      });
    }
    moveAt(movingElement, event.pageX, event.pageY);

    elementBelow = getElementBelow(movingElement, "by-center");
    if (!elementBelow) return;
    let droppableBelow = elementBelow.closest(".board-item");
    if (currentDroppable != droppableBelow) {
      //  currentDroppable=null
      //    if we were not over a droppable element before this event
      //  droppableBelow=null
      //    if we are not over a droppable element now, during this event
      currentDroppable = droppableBelow;
      if (currentDroppable) {                             //логика расположения плейсхолдера, не айтема
        if (
          !isAbove(movingElement, currentDroppable) ||    //20:00 двигаемый эл-т и то, куда его можно дропнуть
          currentDroppable.classList.contains("emptySectionHiddenLesson")
        ) {
          currentDroppable.parentNode.insertBefore(
            placeholder,
            currentDroppable
          );
        } else {
          currentDroppable.parentNode.insertBefore(
            placeholder,
            currentDroppable.nextElementSibling
          );
        }
      }
    }
  };

  const setMovingElement = (event) => {
    movingElement = event.target;
  };

  const onMouseUp = () => {
    if (!isDraggingStarted) {
      document.removeEventListener("mousemove", onMouseMove);
      movingElement.onmouseup = null;
      return;
    }

    var nexElSib = placeholder.nextElementSibling;
    var prevElSib = placeholder.previousElementSibling;

    console.log(
      "We move item",
      movingElement,
      "to column",
      placeholder.closest(".column"),
      "before item",
      nexElSib,
      "after item",
      prevElSib
    );

    placeholder.parentNode.insertBefore(movingElement, placeholder);

    //устанавливаем номер столбца у задачи после переноса
    movingElement.dataset.itemColId = placeholder.closest(".column").dataset.colId


    Object.assign(movingElement.style, {
      position: "static",
      left: "auto",
      top: "auto",
      zIndex: "auto",
      transform: "none",
    });

    document.removeEventListener("mousemove", onMouseMove);
    isDraggingStarted = false;
    placeholder && placeholder.parentNode.removeChild(placeholder);

    //тут должна быть логика изменения индексов задач
    //после каждого переноса индексы элементов проставляются заново\
    //создаваемая задача появляетсяя без id. Он создаётся автоматически бд-шкой. Т.е. при следующей загрузке задач id у всех уже будет


    // Находим все элементы класса column
    var columns = document.querySelectorAll('.column');

    // Проходим по каждому элементу column
    columns.forEach(function (column) {
      // Находим все элементы класса board-item внутри текущей колонки
      var items = column.querySelectorAll('.board-item:not(.emptySectionHiddenLesson)');

      var newItemIndex = 1
      // Проходим по каждому элементу board-item
      items.forEach(function (item) {
        // Устанавливаем заново значение атрибута data-item-id у каждого элемента с выводом в консоль
        item.dataset.itemId = newItemIndex;
        newItemIndex+=1;
      });
    });
    //

    movingElement.onmouseup = null;
    movingElement = null;

    // Process empty columns without items
    processEmptySections();
  };

  const onMouseDown = (event) => {
    setMovingElement(event);
    shifts.set(event.clientX, event.clientY, movingElement);
    initialMovingElementPageXY.set(movingElement);
    document.addEventListener("mousemove", onMouseMove);
    movingElement.onmouseup = onMouseUp;
  };

  window.addEventListener("load", () => {
    for (const draggableElement of document.querySelectorAll(".board-item")) {
      draggableElement.onmousedown = onMouseDown;
      draggableElement.ondragstart = () => {
        return false;
      };
    }
  });




function createTask() {

    // Найти элемент с классом 'column' и атрибутом 'data-col-id' равным '1'
    var column = document.querySelector('.column[data-col-id="1"]');
    // Найти элемент с классом 'board-column-content-wrapper' внутри найденного элемента 'column'
    var contentWrapper = column.querySelector('.board-column-content-wrapper');

    var items = column.querySelectorAll('.board-item:not(.emptySectionHiddenLesson)');



    // Создаем элемент div
    var boardItem = document.createElement('div');
    // Добавляем ему класс 'board-item'
    boardItem.classList.add('board-item');
    // Добавляем атрибуты data
    boardItem.setAttribute('data-item-id', items.length + 1);
    boardItem.setAttribute('data-item-col-id', 1);
    // Добавляем атрибут draggable
    boardItem.setAttribute('draggable', true);
    boardItem.setAttribute('onclick', "createModal()")

    // Создаем элемент div для контента внутри boardItem
    var boardItemContent = document.createElement('div');
    // Добавляем ему класс 'board-item-content'
    boardItemContent.classList.add('board-item-content');
    // Добавляем текст внутри элемента boardItemContent
    boardItemContent.textContent = 'Untitled';

    // Добавляем boardItemContent внутрь boardItem
    boardItem.appendChild(boardItemContent);

    // Создаем элемент div для описания внутри boardItem
    var boardItemDescription = document.createElement('div');
    // Добавляем ему класс 'board-item-description'
    boardItemDescription.classList.add('board-item-description');
    // Добавляем текст внутри элемента boardItemContent
    boardItemDescription.textContent = '';


    // Добавляем boardItemDescription внутрь boardItem
    boardItem.appendChild(boardItemDescription);
    
    // Назначаем обработчики событий на новый элемент
    boardItem.onmousedown = onMouseDown;
    boardItem.ondragstart = () => {
        return false;
    };

    // Добавить 'boardItem' внутрь 'contentWrapper'
    contentWrapper.appendChild(boardItem);







}
