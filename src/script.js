

//Référencement des éléments clés du DOM
const video = document.getElementById('webcam');
const liveView = document.getElementById('liveView');
const demosSection = document.getElementById('demos');
const enableWebcamButton = document.getElementById('webcamButton');


//Vérifier la prise en charge de la webcam
function getUserMediaSupported() {
  return !!(navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia);
}


if (getUserMediaSupported()) {
  enableWebcamButton.addEventListener('click', enableCam);
} else {
  console.warn(' non pris en charge par votre navigateur');
}

//Récupérer le flux de la webcam
function enableCam(event) {

  if (!model) {
    return;
  }

  // Hide the button once clicked.
  event.target.classList.add('removed');

  // getUsermedia parameters to force video but not audio.
  const constraints = {
    video: true
  };

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    video.srcObject = stream;
    video.addEventListener('loadeddata', predictWebcam);
  });
}


//Chargement du modèle
let model = undefined;

cocoSsd.load().then(function (loadedModel) {
  model = loadedModel;

  demosSection.classList.remove('invisible');
});

//Classer une image depuis la webcam
const children = [];

function predictWebcam() {

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
          + (predictions[n].bbox[1] + 40) + 'px; width: '
          + (predictions[n].bbox[2] - 40) + 'px; top: 0; left: 0;';

        const highlighter = document.createElement('div');
        highlighter.setAttribute('class', 'highlighter');
        highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
          + (predictions[n].bbox[1] + 40) + 'px; width: '
          + (predictions[n].bbox[2] - 40) + 'px; height: '
          + predictions[n].bbox[3] + 'px;';

        liveView.appendChild(highlighter);
        liveView.appendChild(p);
        children.push(highlighter);
        children.push(p);
      }
    }

    window.requestAnimationFrame(predictWebcam);
  });
}
