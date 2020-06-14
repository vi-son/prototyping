console.log("Welcome.");

let essentia;
let isEssentiaInstance = false;

document.onreadystatechange = function() {
  if (document.readyState === "complete") {
    console.log("Document is ready...");
    EssentiaModule().then(function(essentiaModule) {
      if (!isEssentiaInstance) {
        essentia = new Essentia(essentiaModule);
        isEssentiaInstance = true;
        console.log(essentia.version);
        const h1 = document.createElement("H1");
        h1.innerText = `essentia.js version: ${essentia.version}`;
        document.querySelector("body").appendChild(h1);
      }
    });
  }
};
