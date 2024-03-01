let filterBar = document.getElementById("filterBar");
let filterButton = document.getElementById("filter-button");
let saveButton = document.getElementById("save-button");


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