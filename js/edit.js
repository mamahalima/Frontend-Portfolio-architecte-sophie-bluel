
import {
  handleImageFile,
  showImagePreview,
  resetAddContainer,
  updateValidateButton,
  deleteProject,
  addImageToGallery,
  displayWorksOnHomepage,
  displayWorksInModal,
  loadWorks,
  getCurrentImageData,
  setCurrentImageData
} from './modules/images.js';

import {
  showModal,
  hideModal,
  showAddPhotoView,
  showGalleryView,
  clearForm,
  loadCategories
} from './modules/ui.js';

import {
  checkAuth,
  setupAuthUI
} from './modules/auth.js';

document.addEventListener('DOMContentLoaded', () => {

  console.log('DOMContentLoaded fired');
  console.log('authLink element:', document.getElementById('authLink'));
  
  if (!checkAuth()) return;
  setupAuthUI();

  // Sélecteurs DOM
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');
  const viewGallery = document.getElementById('view-gallery');
  const viewAdd = document.getElementById('view-add');
  const btnOpenModal = document.querySelector('.btn-open-modal');
  const addPhotoBtn = document.getElementById('add-photo-btn');
  const fileInput1 = document.getElementById('file-input1');
  const closeModals = document.querySelectorAll('.close-modal');
  const goBackBtn = document.getElementById('goBack');
  const titleInput = document.getElementById('title');
  const categorySelect = document.getElementById('category');
  const validateButton = document.getElementById('validate-button');
  const addContainer = document.querySelector('.add');
  let fileInput;

  
  function init() {
    fileInput = resetAddContainer(addContainer, (e) =>
      handleImageFile(e, () => updateValidateButton(validateButton, titleInput, categorySelect, getCurrentImageData()), (src) => showImagePreview(src, addContainer))
    );

    validateButton.disabled = true;
    validateButton.style.backgroundColor = '#A7A7A7';
    loadCategories(categorySelect);
  }

  init();

  
  btnOpenModal.addEventListener('click', () => {
    showModal(modal, viewGallery, viewAdd);
    loadWorks(
      (works) => displayWorksInModal(works, modalContent),
      (works) => displayWorksOnHomepage(works, document.querySelector('.gallery'))
    );
    loadCategories(categorySelect);
  });

  closeModals.forEach(btn => btn.addEventListener('click', () => hideModal(modal, () =>
    clearForm(titleInput, categorySelect, fileInput, fileInput1, () =>
      resetAddContainer(addContainer, (e) =>
        handleImageFile(e, () => updateValidateButton(validateButton, titleInput, categorySelect, getCurrentImageData()), (src) => showImagePreview(src, addContainer))
      ),
      () => updateValidateButton(validateButton, titleInput, categorySelect, getCurrentImageData()),
      (value) => setCurrentImageData(value)
    )
  )));

  goBackBtn.addEventListener('click', () => showGalleryView(viewGallery, viewAdd));

  addPhotoBtn.addEventListener('click', () => {
    showAddPhotoView(viewGallery, viewAdd, (src) => showImagePreview(src, addContainer), null, (value) => setCurrentImageData(value));
    clearForm(titleInput, categorySelect, fileInput, fileInput1, () =>
      resetAddContainer(addContainer, (e) =>
        handleImageFile(e, () => updateValidateButton(validateButton, titleInput, categorySelect, getCurrentImageData()), (src) => showImagePreview(src, addContainer))
      ),
      () => updateValidateButton(validateButton, titleInput, categorySelect, getCurrentImageData()),
      (value) => setCurrentImageData(value)
    );
    loadCategories(categorySelect);
  });

  fileInput1.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (modalContent.children.length >= 15) {
      alert("Vous pouvez ajouter au maximum 15 images.");
      fileInput1.value = '';
      return;
    }
    files.forEach(file => {
      if (modalContent.children.length >= 15) return;
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const src = event.target.result;
          const wrapper = document.createElement('div');
          wrapper.classList.add('image-wrapper');
          const img = document.createElement('img');
          img.src = src;
          img.alt = 'Image ajoutée';
          img.addEventListener('click', () => {
            showAddPhotoView(viewGallery, viewAdd, (src) => showImagePreview(src, addContainer), { src, file }, (value) => setCurrentImageData(value));
          });
          wrapper.appendChild(img);
          modalContent.appendChild(wrapper);
        };
        reader.readAsDataURL(file);
      }
    });
    fileInput1.value = '';
  });

  titleInput.addEventListener('input', () =>
    updateValidateButton(validateButton, titleInput, categorySelect, getCurrentImageData())
  );
  categorySelect.addEventListener('change', () =>
    updateValidateButton(validateButton, titleInput, categorySelect, getCurrentImageData())
  );

  validateButton.addEventListener('click', async () => {
    const title = titleInput.value.trim();
    const categoryId = categorySelect.value;
    const file = getCurrentImageData()?.file;

    if (!file || !title || !categoryId) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('category', categoryId);

    try {
      const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du projet');
      }

      const newProject = await response.json();

      addImageToGallery(
        newProject.imageUrl,
        newProject.title,
        categorySelect.options[categorySelect.selectedIndex].text,
        newProject.id,
        modalContent
      );

      const homepageGallery = document.querySelector('.gallery');
      const figure = document.createElement('figure');
      figure.dataset.id = newProject.id;

      const img = document.createElement('img');
      img.src = newProject.imageUrl;
      img.alt = newProject.title;

      const caption = document.createElement('figcaption');
      caption.textContent = newProject.title;

      figure.appendChild(img);
      figure.appendChild(caption);

      homepageGallery.appendChild(figure);

      alert('Projet ajouté avec succès !');
      showGalleryView(viewGallery, viewAdd);
      clearForm(titleInput, categorySelect, fileInput, fileInput1, () =>
        resetAddContainer(addContainer, (e) =>
          handleImageFile(e, () => updateValidateButton(validateButton, titleInput, categorySelect, getCurrentImageData()), (src) => showImagePreview(src, addContainer))
        ),
        () => updateValidateButton(validateButton, titleInput, categorySelect, getCurrentImageData()),
        (value) => setCurrentImageData(value)
      );

    } catch (error) {
      console.error(error);
      alert('Une erreur est survenue lors de l\'envoi');
    }
  });
});
