// ПОТОМ УДАЛИТЬ
document.getElementById('fetchButton').addEventListener('click', () => {
    fetch('http://localhost:8080/example/testget') // Замените на реальный путь к вашему контроллеру
        .then(response => response.json())
        .then(data => {
            const projectContainer = document.getElementById('projectContainer');
            projectContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых ссылок

            Object.keys(data).forEach(key => {
                const projectName = data[key];
                const projectLink = document.createElement('a');
                projectLink.href = '#';
                projectLink.textContent = projectName;
                projectLink.className = 'project-link';
                projectContainer.appendChild(projectLink);
            });
        })
        .catch(error => {
            console.error('Error fetching projects:', error);
        });
});