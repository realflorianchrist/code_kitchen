function toggleFilterBar() {
    let filterBar = document.getElementById("filterBar");
    filterBar.style.display = (filterBar.style.display === "none") ? "block" : "none";
}

let filterButton = document.querySelector(".filter-button");
filterButton.addEventListener("click", toggleFilterBar);

// document.addEventListener("click", function(event) {
//     let filterBar = document.getElementById("filterBar");
//     let filterButton = document.querySelector(".filter-button");
//
//     if (!filterBar.contains(event.target) && event.target !== filterButton) {
//         filterBar.style.display = "none";
//     }
// });