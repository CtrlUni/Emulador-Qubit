let modelContainer = document.getElementById("container");

let inputLayer = new TSP.layers.GreyscaleInput({ shape: [28, 28, 1] });

let convLayer1 =  new TSP.layers.Conv2d({ kernelSize: 5, filters: 6, strides: 1, padding: "same" });

convLayer1.apply(inputLayer);

let convLayer2 =  new TSP.layers.Conv2d({ kernelSize: 5, filters: 6, strides: 1, padding: "same" });

convLayer2.apply(inputLayer);

let addLayer = TSP.layers.Add([convLayer1, convLayer2]);

let model = new TSP.models.Model(modelContainer, {
  inputs: [inputLayer],
  outputs: [addLayer]
});

model.init();