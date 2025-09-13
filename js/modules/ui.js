
export function showModal(modal, viewGallery, viewAdd) {
  modal.style.display = 'flex';
  viewGallery.style.display = 'block';
  viewAdd.style.display = 'none';
}

export function hideModal(modal, clearFormCallback) {
  modal.style.display = 'none';
  clearFormCallback();
}

export function showAddPhotoView(viewGallery, viewAdd, showImagePreview, imageData = null, setCurrentImageData) {
  viewGallery.style.display = 'none';
  viewAdd.style.display = 'flex';
  if (imageData) {
    setCurrentImageData(imageData);
    showImagePreview(imageData.src);
  }
}

export function showGalleryView(viewGallery, viewAdd) {
  viewAdd.style.display = 'none';
  viewGallery.style.display = 'block';
}

export function clearForm(titleInput, categorySelect, fileInput, fileInput1, resetAddContainer, updateValidateButton, setCurrentImageData) {
  setCurrentImageData(null);
  titleInput.value = '';
  categorySelect.value = '';
  fileInput.value = '';
  fileInput1.value = '';
  resetAddContainer();
  updateValidateButton();
}

export async function loadCategories(categorySelect) {
  try {
    const response = await fetch('http://localhost:5678/api/categories', {
      method: 'GET'
    });
    const categories = await response.json();
    categorySelect.innerHTML = '<option value="">Choisissez une catégorie</option>';
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error('Erreur chargement catégories :', error);
  }
}
