// Изначальные pageX и pageY элемента movingElement в момент начала перетаскивания
const initialMovingElementPageXY = {
  x: 0,
  y: 0,
  set: (movingElement) => {
    const rect = movingElement.getBoundingClientRect();
    initialMovingElementPageXY.x = rect.x + window.scrollX;
    initialMovingElementPageXY.y = rect.y + window.scrollY;
  },
};

// Хранит смещения по x и y относительно левого верхнего угла элемента movingElement до точки переноса
const shifts = {
  shiftX: 0,
  shiftY: 0,
  set: (clientX, clientY, movingElement) => {
    shifts.shiftX = clientX - movingElement.getBoundingClientRect().left;
    shifts.shiftY = clientY - movingElement.getBoundingClientRect().top;
  },
};

const moveAt = (element, pageX, pageY) => {
  // Передвигает element на координаты pageX и pageY используя метод CSS transform 
  element.style.transform = `translate(${
    pageX - initialMovingElementPageXY.x - shifts.shiftX
  }px, ${
    pageY - initialMovingElementPageXY.y - shifts.shiftY
  }px) rotate(-3deg)`;
};

const getElementCoordinates = (node, searchCoordsBy) => {
  // возвращает left и top координаты node
  const rect = node.getBoundingClientRect();
  return {
    top:
      searchCoordsBy == "by-center"
        ? rect.top + rect.height / 2
        : rect.top + 10,
    left: rect.left + rect.width / 2,
  };
};

const isAbove = (nodeA, nodeB) => {
  // возвращает координаты прямоугольника, содержащего node
  const rectA = nodeA.getBoundingClientRect();
  const rectB = nodeB.getBoundingClientRect();

  return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
};

const isRight = (nodeA, nodeB) => {
  // возвращает координаты прямоугольника, содержащего node
  const rectA = nodeA.getBoundingClientRect();
  const rectB = nodeB.getBoundingClientRect();

  return rectA.left + rectA.width / 2 < rectB.left + rectB.width / 2;
};

const getElementBelow = (movingElement, searchCoordsBy) => {
  // получает элемент находящийся под movingElement в моменте
  const movingElementCenter = getElementCoordinates(
    movingElement,
    searchCoordsBy
  );
  movingElement.hidden = true;
  let elementBelow = document.elementFromPoint(
    movingElementCenter.left,
    movingElementCenter.top
  );
  movingElement.hidden = false;
  return elementBelow;
};
