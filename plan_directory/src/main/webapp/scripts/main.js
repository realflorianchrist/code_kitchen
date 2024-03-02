let filterBar = document.getElementById("filterBar");
let filterButton = document.getElementById("filter-button");
let saveButton = document.getElementById("save-button");


// Diesen Teil habe ich zum Teil aus dem Internet

/*
document.addEventListener('DOMContentLoaded', function () {
    fetchData();
});

async function fetchData() {
    try {
        const apiUrl = 'http://localhost:3000/deine-api-endpoint/tabelle';

        const response = await fetch(apiUrl);
        const data = await response.json();

        data.forEach(row => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `<td>${row.plan_nr}</td><td>${row.plan_path}</td>`;

            table.appendChild(newRow);
        });
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
    }
}
*/

function toggleFilterBar() {
    filterBar.style.display = (filterBar.style.display === "none") ? "block" : "none";
}

filterButton.addEventListener("click", toggleFilterBar);

function saveButtonPressed() {
    toggleFilterBar();
}

saveButton.addEventListener("click", saveButtonPressed);

document.addEventListener("click", function(event) {
    if (!filterBar.contains(event.target) && event.target !== filterButton) {
        filterBar.style.display = "none";
    }
});