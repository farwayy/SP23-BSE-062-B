function loadDescription(file, elementId) {
    fetch(file)
    .then(response => response.text())
    .then(data => {
        const descriptionDiv = document.getElementById(elementId);
        descriptionDiv.style.display = 'block';
        descriptionDiv.innerHTML = `<p>${data}</p>`;
    })
    .catch(error => {
        document.getElementById(elementId).innerHTML = `<p>Error loading description.</p>`;
    });
}
