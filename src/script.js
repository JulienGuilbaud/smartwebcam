

//Référencement des éléments clés du DOM
const video = document.getElementById('webcam');
const liveView = document.getElementById('liveView');
const demosSection = document.getElementById('demos');
const stateNAV= document.getElementById('NAV');
const stateMOD= document.getElementById('MOD');
const stateWCAM= document.getElementById('WCAM')
const stateSAM= document.getElementById('SAM')



//Vérifier la prise en charge de la webcam
if (getUserMediaSupported()) {
  stateNAV.textContent="pris en charge"
} else {
  stateNAV.textContent="non pris en charge"
  console.warn(' non pris en charge par votre navigateur');
}
function getUserMediaSupported() {
  return !!(navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia);
}

//Récupérer le flux de la webcam
function enableCam() {
 
  // getUsermedia parameters to force video but not audio.
  const constraints = {
    video: true
  };
  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    video.srcObject = stream; 
    video.addEventListener('loadeddata', predictWebcam);
    stateWCAM.textContent="connectée"

  });
}

//Chargement du modèle
let model = undefined;
cocoSsd.load().then(function (loadedModel) {
  model = loadedModel;
  stateMOD.textContent="chargé"
  enableCam()

});

//Classer une image depuis la webcam
const children = [];

function predictWebcam() {

  stateSAM.textContent="activé"

 

  model.detect(video).then(function (predictions) {
    for (let i = 0; i < children.length; i++) {
      liveView.removeChild(children[i]);
    }
    children.splice(0);


    for (let n = 0; n < predictions.length; n++) {

   
      // réglage de la prédiction sur 33%
      if (predictions[n].score > 0.33) {
        const p = document.createElement('p');
        p.textContent =
          predictions[n].class + ' avec ' + Math.round(parseFloat(predictions[n].score) * 100) + '% de confiance.';

        p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
          + (predictions[n].bbox[1]) + 'px; width: '
          + (predictions[n].bbox[2]) + 'px; top: 0; left: 0;';

        const highlighter = document.createElement('div');
        highlighter.setAttribute('class', 'highlighter');
        
        highlighter.style = 'left: ' + (predictions[n].bbox[0]+20) + 'px; top: '
          + (predictions[n].bbox[1]-30) + 'px; width: '
          + (predictions[n].bbox[2]) + 'px; height: '
          + (predictions[n].bbox[3]+50) + 'px;';

        liveView.appendChild(highlighter);
        liveView.appendChild(p);
        children.push(highlighter);
        children.push(p);
      }
    }
    //Demande à l'API d'animation de planifier la prochaine exécution de predictWebcam()
    window.requestAnimationFrame(predictWebcam);
  });
}


