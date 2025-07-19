
// --- 1. Références aux éléments du DOM ---
// On récupère les éléments HTML dont on aura besoin pour manipuler la page.
const video = document.getElementById('webcam');
const liveView = document.getElementById('liveView');
const demosSection = document.getElementById('demos');
const stateNAV = document.getElementById('NAV'); // Affiche l'état du support de l'API par le navigateur.
const stateMOD = document.getElementById('MOD'); // Affiche l'état de chargement du modèle.
const stateWCAM = document.getElementById('WCAM'); // Affiche l'état de la connexion à la webcam.
const stateSAM = document.getElementById('SAM'); // Affiche l'état de l'échantillonnage (détection).



// --- 2. Vérification du support de la webcam ---
if (getUserMediaSupported()) {
  stateNAV.textContent = "pris en charge";
} else {
  stateNAV.textContent = "non pris en charge";
  console.warn(' non pris en charge par votre navigateur');
}

/**
 * Vérifie si l'API MediaDevices.getUserMedia() est prise en charge par le navigateur.
 * @returns {boolean}
 */
function getUserMediaSupported() {
  return !!(navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia);
}

/**
 * Demande l'accès à la webcam de l'utilisateur et démarre le flux vidéo.
 * Cette fonction est appelée une fois que le modèle est chargé.
 */
function enableCam() {
  // Définit les contraintes pour la capture : on veut la vidéo, pas l'audio.
  const constraints = {
    video: true
  };
  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    video.srcObject = stream; 
    video.addEventListener('loadeddata', predictWebcam);
    stateWCAM.textContent = "connectée";

  });
}

// --- 3. Chargement du modèle et activation de la webcam ---
// Variable qui contiendra le modèle de détection d'objets chargé.
let model = undefined;

// Charge le modèle pré-entraîné COCO-SSD (Common Objects in Context - Single Shot MultiBox Detector).
// C'est une opération asynchrone qui retourne une promesse.
cocoSsd.load().then(function (loadedModel) {
  model = loadedModel;
  // Une fois le modèle chargé, on met à jour l'interface utilisateur.
  stateMOD.textContent = "chargé";
  // On active ensuite la webcam.
  enableCam();
});

// --- 4. Boucle de prédiction ---
// Tableau pour garder une référence aux éléments (boîtes et textes) ajoutés sur la vue.
const children = [];

/**
 * Fonction principale qui s'exécute en boucle pour analyser le flux vidéo et afficher les détections.
 */
function predictWebcam() {
  // Met à jour l'état de l'échantillonnage dans l'interface.
  stateSAM.textContent = "activé";

  // Détecte les objets dans le frame actuel de la vidéo. C'est une opération asynchrone.
  model.detect(video).then(function (predictions) {
    // Boucle pour supprimer les anciennes boîtes de détection de l'affichage.
    for (let i = 0; i < children.length; i++) {
      liveView.removeChild(children[i]);
    }
    // Vide le tableau des enfants pour le prochain cycle.
    children.splice(0);

    // Boucle sur toutes les prédictions retournées par le modèle.
    for (let n = 0; n < predictions.length; n++) {
      // On ne garde que les prédictions avec un score de confiance supérieur à 51%.
      if (predictions[n].score > 0.51) {
        // Crée un élément <p> pour afficher le label et le score de la détection.
        const p = document.createElement('p');
        p.textContent =
          predictions[n].class + ' avec ' + Math.round(parseFloat(predictions[n].score) * 100) + '% de confiance.';

        // Positionne le texte et la boîte en utilisant les coordonnées (bbox) fournies par le modèle.
        p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
          + (predictions[n].bbox[1]) + 'px; width: '
          + (predictions[n].bbox[2]) + 'px; top: 0; left: 0;';

        // Crée un élément <div> pour dessiner la boîte englobante (le "highlighter").
        const highlighter = document.createElement('div');
        highlighter.setAttribute('class', 'highlighter');
        highlighter.style = 'left: ' + (predictions[n].bbox[0]+20) + 'px; top: '
          + (predictions[n].bbox[1]-30) + 'px; width: '
          + (predictions[n].bbox[2]) + 'px; height: '
          + (predictions[n].bbox[3]+50) + 'px;';

        // Ajoute les nouveaux éléments à la vue et au tableau `children` pour pouvoir les supprimer au prochain frame.
        liveView.appendChild(highlighter);
        liveView.appendChild(p);
        children.push(highlighter);
        children.push(p);
      }
    }
    //Demande à l'API d'animation de planifier la prochaine exécution de predictWebcam()
    // Cela crée une boucle de rendu fluide et performante.
    window.requestAnimationFrame(predictWebcam);
  });
}
