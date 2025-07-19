 # Smart Webcam - Détection d'Objets en Temps Réel
 
 [![Deploy with Vercel](https://vercel.com/button)](https://smartwebcam-demo.vercel.app/)
 
 Ce projet est une application web simple qui utilise TensorFlow.js et le modèle pré-entraîné COCO-SSD pour effectuer de la détection d'objets en temps réel à partir du flux d'une webcam.
 
 ## 🚀 Démo Live
 
 Une version de démonstration est déployée sur Vercel. Vous pouvez la tester ici :
 **[https://smartwebcam-demo.vercel.app/](https://smartwebcam-demo.vercel.app/)**
 
 ## ✨ Fonctionnalités
 
 - **Détection en temps réel** : Analyse le flux vidéo de la webcam frame par frame.
 - **Modèle COCO-SSD** : Utilise un modèle d'IA puissant capable de reconnaître 90 types d'objets différents.
 - **Interface visuelle** : Affiche des boîtes englobantes (bounding boxes) autour des objets détectés.
 - **Scores de confiance** : Indique la probabilité que la détection soit correcte pour chaque objet.
 - **Indicateurs d'état** : Affiche l'état du chargement du modèle et de la connexion à la webcam.
 
 ## 🛠️ Technologies utilisées
 
 - **HTML5** : Structure de la page.
 - **CSS3** : Style et mise en page.
 - **JavaScript (ES6+)** : Logique de l'application.
 - **[TensorFlow.js](https://www.tensorflow.org/js)** : Bibliothèque de machine learning pour le web.
 - **[Modèle COCO-SSD](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd)** : Modèle de détection d'objets.
 - **[Parcel](https://parceljs.org/)** : Bundler d'application web sans configuration.
 
 ## ⚙️ Installation et Lancement Local
 
 Pour faire fonctionner ce projet sur votre machine, suivez ces étapes :
 
 1.  **Clonez le dépôt :**
     ```bash
     git clone https://github.com/VOTRE_NOM_UTILISATEUR/smartwebcam.git
     cd smartwebcam
     ```
 
 2.  **Installez les dépendances :**
     (Nécessite [Node.js](https://nodejs.org/))
     ```bash
     npm install
     ```
 
 3.  **Lancez le serveur de développement :**
     ```bash
     npm start
     ```
     Ouvrez votre navigateur à l'adresse `http://localhost:1234`.
 
 4.  **Pour compiler pour la production :**
     ```bash
     npm run build
     ```
     Les fichiers compilés seront dans le dossier `dist`.
 
 ## 📖 Fonctionnement
 
 Le script principal (`src/script.js`) suit les étapes suivantes :
 1.  Il vérifie d'abord si le navigateur prend en charge l'API `getUserMedia` pour l'accès à la webcam.
 2.  Il charge le modèle d'IA **COCO-SSD** via TensorFlow.js.
 3.  Une fois le modèle chargé, il demande l'autorisation d'accéder à la webcam de l'utilisateur.
 4.  Si l'accès est accordé, le flux vidéo est affiché sur la page.
 5.  Une boucle de prédiction s'exécute en continu :
     - À chaque frame, la fonction `model.detect()` est appelée avec l'image actuelle de la webcam.
     - Les prédictions retournées (objets, positions, scores) sont utilisées pour dessiner des rectangles et des labels sur la vidéo.
     - Le processus se répète grâce à `window.requestAnimationFrame()` pour une performance optimale.
 
 ## 📜 Licence
 
 Ce projet est sous licence ISC. Voir le fichier `LICENSE` pour plus de détails.