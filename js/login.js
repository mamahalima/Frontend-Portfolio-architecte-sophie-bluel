
document.getElementById('logForm').addEventListener('submit', async function(e) {
    e.preventDefault(); 
  
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = "";
    errorDiv.style.display = 'none';
  
    try {
      const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
  
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        console.log('Token reçu :', data.token);
        window.location.replace('index.html'); 
      } else {
        errorDiv.textContent = data.message || "Identifiants incorrects.";
        errorDiv.style.color = 'red';
        errorDiv.style.display = 'block';
      }
  
    } catch (error) {
      console.error('Erreur lors de la requête :', error);
      errorDiv.textContent = "Erreur serveur. Veuillez réessayer plus tard.";
      errorDiv.style.color = 'red';
      errorDiv.style.display = 'block';
    }
  });
  