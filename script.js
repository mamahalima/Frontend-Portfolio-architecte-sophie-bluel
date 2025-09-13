console.log("JS Script loaded!");

const gallery = document.querySelector(".gallery");
const filtersContainer = document.getElementById("filters");

let allWorks = [];


function displayGallery(workList) {
  gallery.innerHTML = "";

  workList.forEach(work => {
    const figure = document.createElement("figure");

    const image = document.createElement("img");
    image.src = work.imageUrl;
    image.alt = work.title;

    const caption = document.createElement("figcaption");
    caption.textContent = work.title;

    figure.appendChild(image);
    figure.appendChild(caption);
    gallery.appendChild(figure);
  });
}


function applyFiltering() {
  const buttons = document.querySelectorAll("#filters button");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const categoryId = button.dataset.id;

      buttons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");

      const filteredWorks = categoryId === "all"
        ? allWorks
        : allWorks.filter(w => w.category.id == categoryId);

      displayGallery(filteredWorks);
    });
  });
}


async function loadFilters() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();

    
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.dataset.id = "all";
    allButton.classList.add("active");
    filtersContainer.appendChild(allButton);

    
    categories.forEach(category => {
      const button = document.createElement("button");
      button.textContent = category.name;
      button.dataset.id = category.id;
      filtersContainer.appendChild(button);
    });

    applyFiltering();

  } catch (error) {
    console.error("Error loading filters:", error);
  }
}


async function loadWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    allWorks = await response.json();
    displayGallery(allWorks);
  } catch (error) {
    console.error("Error loading works:", error);
  }
}

async function init() {
  await loadWorks();
  await loadFilters();
}

init();
