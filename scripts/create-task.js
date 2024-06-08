
let currentDroppable = null;
let placeholder;
let isDraggingStarted = false;
let movingElement;

//проверяет наличие кнопок добавления новых задач в солбцах, и добавляет их при отсутствии
const processEmptySections = () => {
  // Create not visible .board-item in empty sections to dnd work with it too
  document
    //проходимся по всем столбцам
    .querySelectorAll(".board-column-content-wrapper")
    .forEach((section) => {
      let column = section.closest(".column");

      if (
        !section.querySelector(".board-item.emptySectionHiddenLesson")
      ) {

        const emptySectionHiddenLesson = document.createElement("div");
        emptySectionHiddenLesson.setAttribute("data-task-col-num", column.dataset.colPos);
        emptySectionHiddenLesson.setAttribute('draggable', false);

        emptySectionHiddenLesson.classList.add(
          "board-item",
          "emptySectionHiddenLesson"
        );
        emptySectionHiddenLesson.innerHTML = "+ Добавить";
        emptySectionHiddenLesson.style.textAlign = "center";
        //emptySectionHiddenLesson.setAttribute("onclick", "createTask('${col_number}')")
        emptySectionHiddenLesson.onclick = function () { createTask(column.dataset.colPos, column.dataset.colId); }
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
  movingElement.dataset.taskColNum = placeholder.closest(".column").dataset.colPos


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

    var newItemIndex = 1;
    // Проходим по каждому элементу board-item
    items.forEach(function (item) {
      // Устанавливаем заново значение атрибута data-task-pos у каждого элемента с выводом в консоль
      item.dataset.taskPos = newItemIndex;
      newItemIndex += 1;
    });
  });

  let isTaskPosChanged = changeTaskPosition(movingElement.dataset.taskId, movingElement.closest(".column").dataset.colId, movingElement.dataset.taskPos);
  if (!isTaskPosChanged) {
    alert("перенести задачу не удалось, обновите страницу");
    return;
  }


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

  horizontalScroll();



  movingElement.onmouseup = onMouseUp;
};

window.addEventListener("load", () => {
  for (const draggableElement of document.querySelectorAll(".board-item:not(.emptySectionHiddenLesson)")) {
    draggableElement.onmousedown = onMouseDown;
    draggableElement.ondragstart = () => {
      return false;
    };
  }
});







async function createTask(columnPosition, columnId) {
  //console.log(col_number);
  // Найти элемент с классом 'column' и атрибутом 'data-col-id' равным col_number
  // var column = document.querySelector('.column[data-col-id="1"]');
  let newTaskName = "Task";
  let newTaskDesc = "Description";

  var column = document.querySelector(`.column[data-col-pos="${columnPosition}"]`);
  //console.log(column);
  // Найти элемент с классом 'board-column-content-wrapper' внутри найденного элемента 'column'
  var contentWrapper = column.querySelector('.board-column-content-wrapper');

  var items = column.querySelectorAll('.board-item:not(.emptySectionHiddenLesson)');

  var emptySectionHiddenLesson = column.querySelector('.board-item.emptySectionHiddenLesson');



  // Создаем элемент div
  var boardItem = document.createElement('div');
  // Добавляем ему класс 'board-item'
  boardItem.classList.add('board-item');
  // Добавляем атрибуты data
  boardItem.setAttribute('data-task-pos', items.length + 1);
  boardItem.setAttribute('data-task-col-num', columnPosition);
  // Добавляем атрибут draggable
  boardItem.setAttribute('draggable', true);
  // boardItem.setAttribute('onclick', "createTaskModal()");
  

  // Создаем элемент div для контента внутри boardItem
  var boardItemContent = document.createElement('div');
  // Добавляем ему класс 'board-item-content'
  boardItemContent.classList.add('board-item-content');
  // Добавляем текст внутри элемента boardItemContent
  boardItemContent.textContent = newTaskName;


  // Добавляем boardItemContent внутрь boardItem
  boardItem.appendChild(boardItemContent);

  // Создаем элемент div для описания внутри boardItem
  var boardItemDescription = document.createElement('div');
  // Добавляем ему класс 'board-item-description'
  boardItemDescription.classList.add('board-item-description');
  // Добавляем текст внутри элемента boardItemContent
  boardItemDescription.textContent = newTaskDesc;



  sendTaskToDB(newTaskName, newTaskDesc, columnId)
    .then(newTaskId => {
      if (newTaskId !== false) {
        boardItem.setAttribute("data-task-id", newTaskId);
        boardItem.setAttribute('onclick', `createTaskModal(${newTaskId}, "${newTaskName}", "${newTaskDesc}")`);

      } else {
        alert("Не удалось создать новую задачу");
        return;
      }
    })
    .catch(error => {
      console.error(error);
      alert("Не удалось создать новую задачу");
      return;
    });





  // Добавляем boardItemDescription внутрь boardItem
  boardItem.appendChild(boardItemDescription);

  // Назначаем обработчики событий на новый элемент
  boardItem.onmousedown = onMouseDown;
  boardItem.ondragstart = () => {
    return false;
  };

  // Добавить 'boardItem' внутрь 'contentWrapper'
  // contentWrapper.appendChild(boardItem);
  contentWrapper.insertBefore(boardItem, emptySectionHiddenLesson);


}


//отправить имя, номер позиции и id проекта
async function sendTaskToDB(taskName, taskDesc, taskStatusId) {
  try {
    const taskInfo = {
      name: taskName,
      description: taskDesc,
      statusId: taskStatusId
    };

    const response = await fetch('http://localhost:8080/api/v1/createTask', {
      method: 'POST', // Метод POST
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(taskInfo) // Преобразование данных в JSON и установка в тело запроса
    });

    if (!response.ok) {
      throw new Error('Сервер не вернул созданную задачу ' + response.statusText);
    }

    const returnedTask = await response.json();
    let taskId = returnedTask.id
    return taskId;


  } catch (error) {
    console.error('При отправке задачи на сервер возникла ошибка:', error);
    return false;
  }
}




// function deleteTask(summoner) {
//   let outerDiv = summoner.parentElement.parentElement;
//   outerDiv.removeChild(summoner.parentElement);
// }

async function deleteTask(taskId) {
  try {
    let taskToDelete = document.querySelector(`.board-item[data-task-id="${taskId}"]`);
    if (taskToDelete == null) {
      alert("Удаляемая задача не найдена на доске");
      return false;
    }

    const response = await fetch(`http://localhost:8080/api/v1/deleteTask/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    });

    const returnedStatus = await response.json();
    if (returnedStatus.status == "Success") {
      console.log('задача удалилась на сервере');
      //тут идёт удаление элемента с доски после удаления с сервера
      //нужно добавить переустановку индексов столбцов и задач
      let column = taskToDelete.closest(".column");
      taskToDelete.remove();

      // Находим все элементы класса column
      var columns = document.querySelectorAll('.column');

      // Проходим по  элементу column

        // Находим все элементы класса board-item внутри  колонки
        var items = column.querySelectorAll('.board-item:not(.emptySectionHiddenLesson)');

        var newItemIndex = 1;
        // Проходим по каждому элементу board-item
        items.forEach(function (item) {
          // Устанавливаем заново значение атрибута data-task-pos у каждого элемента с выводом в консоль
          item.dataset.taskPos = newItemIndex;
          newItemIndex += 1;
        });
      


      return true;
    } else if (returnedStatus.status == "fail") {
      alert("Не удалось удалить задачу. Сервер не нашёл и не удалил задачу");
      return false;
    } else {
      console.log("при удалении задачи что-то пошло совсем не так")
      return false;
    }



  } catch (error) {
    console.error('при обращении на сервер произошла ошибка', error);
    return false;
  }
}



async function changeTaskPosition(taskId, newStatusId, newPosition) {
  const response = await fetch(`http://localhost:8080/api/v1/editTaskPosition/${taskId}/${newStatusId}/${newPosition}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
  const returnedStatus = await response.json();
  if (returnedStatus.status == "Success") {
    console.log('позиция задачи изменилась на сервере');
    return true;
  } else if (returnedStatus.status == "fail") {
    console.log("не удалось изменить позицию задачи на сервере");
    return false;
  } else {
    console.log("при удалении статуса что-то пошло совсем не так")
    return false;
  }

}
