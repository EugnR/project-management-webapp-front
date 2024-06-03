
document.addEventListener('DOMContentLoaded', (event) => {
    getQueryParams();
});



// Функция для получения значений параметров из URL
function getQueryParams() {
    let params = {};
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);

    for (let pair of urlParams.entries()) {
        params[pair[0]] = pair[1];
    }

    document.querySelector('h1').innerHTML = `Проект ${params['projectid']}: ${params['projectname']} `;
}