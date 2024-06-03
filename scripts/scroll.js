function horizontalScroll() {
    let scrollSpeed = 1; // Скорость прокрутки
    let scrolling = false;

    function scrollLogic(e) {
        let windowWidth = window.innerWidth;
        let mouseX = e.clientX;

        if (mouseX < 500) {
            // Наведение на левый край
            scrolling = true;
            scrollLeft();
        } else if (mouseX > windowWidth - 500) {
            // Наведение на правый край
            scrolling = true;
            scrollRight();
        } else {
            scrolling = false;
        }
    }

    document.body.addEventListener('mousemove', scrollLogic(event));

    function scrollLeft() {
        if (scrolling) {
            window.scrollBy(-scrollSpeed, 0);
            requestAnimationFrame(scrollLeft);
        }
    }

    function scrollRight() {
        if (scrolling) {
            window.scrollBy(scrollSpeed, 0);
            requestAnimationFrame(scrollRight);
        }
    }

    document.body.addEventListener('mouseleave', () => {
        scrolling = false;
        removeEventListener("mousemove", scrollLogic(event));
    });
}


// document.addEventListener('DOMContentLoaded', (event) => {
//     let scrollSpeed = 1; // Скорость прокрутки
//     let scrolling = false;

//     document.body.addEventListener('mousemove', (e) => {
//         let windowWidth = window.innerWidth;
//         let mouseX = e.clientX;

//         if (mouseX < 500) {
//             // Наведение на левый край
//             scrolling = true;
//             scrollLeft();
//         } else if (mouseX > windowWidth - 500) {
//             // Наведение на правый край
//             scrolling = true;
//             scrollRight();
//         } else {
//             scrolling = false;
//         }
//     });

//     function scrollLeft() {
//         if (scrolling) {
//             window.scrollBy(-scrollSpeed, 0);
//             requestAnimationFrame(scrollLeft);
//         }
//     }

//     function scrollRight() {
//         if (scrolling) {
//             window.scrollBy(scrollSpeed, 0);
//             requestAnimationFrame(scrollRight);
//         }
//     }

//     document.body.addEventListener('mouseleave', () => {
//         scrolling = false;
//     });
// });
