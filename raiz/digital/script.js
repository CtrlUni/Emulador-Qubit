let numPerceptrons = 50;
let numConnections = 15;
let perceptrons = [],
  connections = [];
let i = 0;

illo = new Zdog.Illustration({
  element: ".zdog",
  resize: "fullscreen",
  dragRotate: true
});

let circle = new Zdog.Shape({
  addTo: illo,
  color: "red",
  stroke: 50,
  fill: true
});

for (i = 0; i < numPerceptrons; i++) {
  let perceptron = new Zdog.Shape({
    addTo: illo,
    stroke: 10,
    translate: { x: 1, y: 2, z: 1 }
  });
  anime({
    targets: perceptron.translate,
    x: anime.random(-120, 120),
    y: anime.random(-120, 120),
    z: anime.random(-120, 120),
    duration: 1000
  });
  perceptrons.push(perceptron);
}
for (i = 0; i < numConnections; i++) {
  let connection = new Zdog.Shape({
    addTo: illo,
    path: [{ line: { x: 0, y: 0, z: 0 } }, { line: { x: 0, y: 0, z: 0 } }],
    stroke: 3
    // color: "gray"
  });
  let travel = () => {
    let p;
    console.log("uhhhh");
    do {
      p = perceptrons[(perceptrons.length * Math.random()) >> 0].translate;
    } while (vectorCompare(p, connection.path[1].line));

    let { x, y, z } = p;

    console.log(connection.path[1]);
    anime
      .timeline({
        easing: "easeInOutExpo",
        duration: 500,
        delay: anime.random(0, 1.5),
        update() {
          connection.updatePath();
        }
      })
      .add({
        targets: connection.path[1].line,
        x,
        y,
        z
      })
      .add({
        targets: connection.path[0].line,
        x,
        y,
        z
      })
      .finished.then(travel);
  };
  travel();
}

animate();

//FUNCTIONS
//=====================================
function animate() {
  illo.updateRenderGraph();
  requestAnimationFrame(animate);
}

function vectorCompare(v1, v2) {
  console.log(v1.x == v2.x && v1.y == v2.y && v1.z == v2.z);
  return v1.x == v2.x && v1.y == v2.y && v1.z == v2.z;
}
