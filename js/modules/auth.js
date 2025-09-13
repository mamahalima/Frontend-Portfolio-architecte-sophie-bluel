
// Vérifie la connexion de l'utilisateur et redirige si nécessaire
export function checkAuth() {
  const token = localStorage.getItem('token');
  const currentPage = window.location.pathname.split('/').pop();

  console.log('[checkAuth] Token:', token);
  console.log('[checkAuth] Current page:', currentPage);

  // Cas connecté: sur login.html  on redirige vers index.html
  if (token && currentPage === 'login.html') {
    console.log('Connecté → redirection vers index.html');
    window.location.replace('index.html');
    return false;
  }

  return true;
}

// Met à jour dynamiquement l'UI selon la connexion
export function setupAuthUI() {
  
  const token = localStorage.getItem('token');
  const currentPage = window.location.pathname.split('/').pop();
  const authLink = document.getElementById('authLink');

  console.log('[setupAuthUI] Current page:', currentPage);
  console.log('[setupAuthUI] Token:', token);
  console.log('[setupAuthUI] authLink found:', !!authLink);

  if (!authLink) return;


  // Appliquer le style actif si on est sur la page de login
  if (currentPage === 'login.html') {
    authLink.classList.add('active-link'); 
  } else {
    authLink.classList.remove('active-link');
  }

  // Éléments UI à afficher/masquer selon connexion
  const editionDiv = document.getElementById("edition");
  const modif = document.querySelector(".modif");
  const filters = document.getElementById("filters");
  const btnOpenModal = document.querySelector(".btn-open-modal");

  if (token) {
    //  Connecté: Affichage des éléments d'édition
    authLink.textContent = 'logout';
    authLink.style.cursor = 'pointer';
    authLink.onclick = () => {
      localStorage.removeItem('token');
      window.location.replace('index.html');
    };

    if (editionDiv) editionDiv.style.display = "flex";
    if (modif) modif.style.display = "flex";
    if (btnOpenModal) btnOpenModal.style.display = "flex";
    if (filters) filters.style.display = "none";

  } else {
    //  Non connecté : Interface publique
    authLink.textContent = 'login';
    authLink.style.cursor = 'pointer';
    authLink.onclick = () => window.location.replace('login.html');
    
    if (editionDiv) editionDiv.style.display = "none";
    if (modif) modif.style.display = "flex";
    if (btnOpenModal) btnOpenModal.style.display = "none";
    if (filters) filters.style.display = "flex";
  }
}
