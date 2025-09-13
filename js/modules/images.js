let currentImageData = null;

export function getCurrentImageData() {
  return currentImageData;
}

export function setCurrentImageData(value) {
  currentImageData = value;
}

export function handleImageFile(e, updateValidateButton, showImagePreview) {
  const file = e.target.files[0];
  const maxSize = 4 * 1024 * 1024;
  const allowedTypes = ['image/jpeg', 'image/png'];

  if (!file) return;

  if (!allowedTypes.includes(file.type)) {
    alert("Seuls les fichiers JPG et PNG sont autorisés.");
    return;
  }

  if (file.size > maxSize) {
    alert("La taille de l'image ne doit pas dépasser 4 Mo.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    currentImageData = { file, src: event.target.result };
    showImagePreview(currentImageData.src);
    updateValidateButton();
  };
  reader.readAsDataURL(file);
}

export function showImagePreview(src, container) {
  container.innerHTML = '';
  const img = document.createElement('img');
  img.src = src;
  img.alt = 'description de l’image';
  img.classList.add('preview-image');
  container.appendChild(img);
}

export function resetAddContainer(addContainer, handleImageFileCallback) {
  addContainer.innerHTML = `
    <i class="fa-regular fa-image"></i>
    <label for="file-input" id="add-button">+ Ajouter photo</label>
    <input type="file" id="file-input" style="display: none;" accept="image/*">
    <p class="jpg">jpg, png : 4mo max</p>
  `;
  const fileInput = document.getElementById('file-input');
  fileInput.addEventListener('change', handleImageFileCallback);
  return fileInput;
}

export function updateValidateButton(validateButton, titleInput, categorySelect, currentImageData) {
  const title = titleInput.value.trim();
  const category = categorySelect.value;
  const file = currentImageData?.file;
  if (file && title && category) {
    validateButton.style.backgroundColor = '#1D6154';
    validateButton.disabled = false;
  } else {
    validateButton.style.backgroundColor = '#A7A7A7';
    validateButton.disabled = true;
  }
}

export function deleteProject(projectId, domElement) {
  const token = localStorage.getItem('token');
  fetch(`http://localhost:5678/api/works/${projectId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    if (response.ok) {
      domElement.remove();
      const mainGalleryElement = document.querySelector(`.gallery [data-id="${projectId}"]`);
      if (mainGalleryElement) {
        mainGalleryElement.remove();
      }     
    } else {
      alert('Erreur lors de la suppression du projet');
    }
  })
  .catch(error => {
    console.error(error);
    alert('Erreur réseau lors de la suppression');
  });
}

export function addImageToGallery(imageUrl, title, categoryName, id, modalContent) {
  const wrapper = document.createElement('figure');
  wrapper.classList.add('image-wrapper');
  wrapper.dataset.id = id; 

  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = title || 'Image';

  const deleteIcon = document.createElement('div');
  deleteIcon.classList.add('material-symbols-outlined', 'delete-icon');
  deleteIcon.textContent = 'delete';
  deleteIcon.addEventListener('click', () => {
    deleteProject(id, wrapper);
  });

  wrapper.appendChild(deleteIcon);
  wrapper.appendChild(img);
  modalContent.appendChild(wrapper);
}

export function displayWorksOnHomepage(works, gallery) {
  gallery.innerHTML = '';
  works.forEach(work => {
    const figure = document.createElement('figure');
    figure.dataset.id = work.id;

    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;

    const caption = document.createElement('figcaption');
    caption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(caption);
    gallery.appendChild(figure);
  });
}

export function displayWorksInModal(works, modalContent) {
  modalContent.innerHTML = '';
  works.forEach(work => {
    const wrapper = document.createElement('figure');
    wrapper.classList.add('image-wrapper');
    wrapper.dataset.id = work.id;

    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title || 'Image';

    const deleteIcon = document.createElement('div');
    deleteIcon.classList.add('material-symbols-outlined', 'delete-icon');
    deleteIcon.textContent = 'delete';
    deleteIcon.addEventListener('click', () => {
      deleteProject(work.id, wrapper);
    });

    wrapper.appendChild(deleteIcon);
    wrapper.appendChild(img);
    modalContent.appendChild(wrapper);
  });
}

export async function loadWorks(displayModal, displayHomepage) {
  try {
     const response = await fetch('http://localhost:5678/api/works', {
      method: 'GET'
    });
    const works = await response.json();
    displayModal(works);
    displayHomepage(works);
  } catch (error) {
    console.error('Erreur chargement travaux :', error);
  }
}
