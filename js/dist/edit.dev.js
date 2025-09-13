"use strict";

var _auth = require("./modules/auth.js");

var _images = require("./modules/images.js");

var _ui = require("./modules/ui.js");

// main.js
// main.js
// si tu as une fonction loadWorks dans images.js
document.addEventListener('DOMContentLoaded', function () {
  // Initialiser l’interface en fonction de l’authentification
  (0, _auth.initAuthUI)(); // Charger les travaux (galerie)

  (0, _images.loadWorks)(); // Initialiser le formulaire d’ajout d’image

  (0, _ui.resetAddContainer)();
  (0, _ui.updateValidateButton)();
});