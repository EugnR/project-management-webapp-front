(() => {
  let currentDroppable = null;
  let placeholder;
  let isDraggingStarted = false;
  let movingElement;

  const processEmptySections = () => {
    // Create not visible .board-item in empty sections to dnd work with it too
    document
      .querySelectorAll(".board-column-content-wrapper")
      .forEach((section) => {
        let col_number = section.closest(".column").dataset.colId

        if (
          !section.querySelector(".board-item.emptySectionHiddenLesson")
        ) {
          const emptySectionHiddenLesson = document.createElement("div");
          emptySectionHiddenLesson.setAttribute("data-item-col-id", col_number);
          emptySectionHiddenLesson.setAttribute('draggable', false);

          emptySectionHiddenLesson.classList.add(
            "board-item",
            "emptySectionHiddenLesson"
          );
          emptySectionHiddenLesson.innerHTML = "+ Добавить";
          emptySectionHiddenLesson.style.textAlign = "center";
          //emptySectionHiddenLesson.setAttribute("onclick", "createTask('${col_number}')")
          emptySectionHiddenLesson.onclick = function () { createTask(col_number); }
          section.append(emptySectionHiddenLesson);
        }
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

        newItemIndex += 1;
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
    processEmptySections();
    // for (const draggableElement of document.querySelectorAll(".board-item")) {
    for (const draggableElement of document.querySelectorAll(".board-item:not(.emptySectionHiddenLesson)")) {
      draggableElement.onmousedown = onMouseDown;
      draggableElement.ondragstart = () => {
        return false;
      };
    }
  });


})();
