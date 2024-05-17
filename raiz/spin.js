"use strict"

// Mude para false se você não quiser um timer
const showTimer = true;

// Defina o tempo de contagem regressiva do cronômetro aqui em minutos: formato de segundos
const time = 0 + ":" + 19; 

//Adicione a lista de nomes aqui
const namesList = ['0','?','1','?'];
/**
'G9: 127',
'Gb9: 126',
'F9: 125',
'E9: 124',
'Eb9: 123',
'D9: 122',
'Db9: 121',
'C9: 120',
'B8: 119',
'Bb8: 118',
'A8: 117',
'Ab8: 116',
'G8: 115',
'Gb8: 114',
'F8: 113',
'E8: 112',
'Eb8: 111',
'D8: 110',
'Db8: 109',
'C8: 108',
'B7: 107',
'Bb7: 106',
'A7: 105',
'Ab7: 104',
'G7: 103',
'Gb7: 102',
'F7: 101',
'E7: 100',
'Eb7: 99',
'D7: 98',
'Db7: 97',
'C7: 96',
'B6: 95',
'Bb6: 94',
'A6: 93',
'Ab6: 92',
'G6: 91',
'Gb6: 90',
'F6: 89',
'E6: 88',
'Eb6: 87',
'D6: 86',
'Db6: 85',
'C6: 84',
'B5: 83',
'Bb5: 82',
'A5: 81',
'Ab5: 80',
'G5: 79',
'Gb5: 78',
'F5: 77',
'E5: 76',
'Eb5: 75',
'D5: 74',
'Db5: 73',
'C5: 72',
'B4: 71',
'Bb4: 70',
'A4: 69',
'Ab4: 68',
'G4: 67',
'Gb4: 66',
'F4: 65',
'E4: 64',
'Eb4: 63',
'D4: 62',
'Db4: 61',
'C4: 60',
'B3: 59',
'Bb3: 58',
'A3: 57',
'Ab3: 56',
'G3: 55',
'Gb3: 54',
'F3: 53',
'E3: 52',
'Eb3: 51',
'D3: 50',
'Db3: 49',
'C3: 48',
'B2: 47',
'Bb2: 46',
'A2: 45',
'Ab2: 44',
'G2: 43',
'Gb2: 42',
'F2: 41',
'E2: 40',
'Eb2: 39',
'D2: 38',
'Db2: 37',
'C2: 36',
'B1: 35',
'Bb1: 34',
'A1: 33',
'Ab1: 32',
'G1: 31',
'Gb1: 30',
'F1: 29',
'E1: 28',
'Eb1: 27',
'D1: 26',
'Db1: 25',
'C1: 24',
'B0: 23',
'Bb0: 22',
'A0: 21',
'Ab0: 20',
'G0: 19',
'Gb0: 18',
'F0: 17',
'E0: 16',
'Eb0: 15',
'D0: 14',
'Db0: 13',
'C0: 12',
];
**/

//Variáveis ​​padrão
let i = 0;
let x = 0;
let intervalHandle = null;
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const headerOne = document.getElementById('headerNames');
const timesUp = document.getElementById('timesUp');
const timerWrapper = document.getElementById('timerWrapper');
const timer = document.getElementById('timer');

//Spin 3D
const N = 6;
let dragStartX;
let dragStartY;
let dragStarted = false;
let currentAngleX = Math.PI/6;
let currentAngleY = Math.PI/8;
let oldAngle = -100000; // indiferente

const width = 360;
const height = 360;
const axisSize = 360;
const axisThick = 8;
const nvThick = 8;
const orbitThick = 8/2; // raio do toro
const radius = 320;
const pointSize = 20;

// Crie um renderizador
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#Spin-a')
});
// Crie uma cena
const scene = new THREE.Scene();
// criar câmera
const camera = new THREE.OrthographicCamera(-480, +480, 480, -480, 1, 1000);

let axes;
let normalVect;

let geometryT;
let materialT;
let torus = 0;

let points;


window.addEventListener('load', init);

const canvas = document.getElementById("Spin-a");
const nvTheta1 = document.getElementById("normalVectorTheta1");
const nvTheta2 = document.getElementById("normalVectorTheta2");
const uAngle = document.getElementById("uAngle");
let sphereV;
canvas.addEventListener('mousedown', onMouseDown, false);
canvas.addEventListener('mousemove', onMouseMove, false);
canvas.addEventListener('mouseup'  , onMouseUp  , false);
canvas.addEventListener('mouseover', onMouseOver, false);

function init() {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  camera.position.set(0, 0, +800);
  
  const light = new THREE.HemisphereLight(0xdddddd, 0x555555, 1.0);
  scene.add(light);

  //Declaração de objeto de caixa
  let geometry1 = new THREE.BoxGeometry(axisSize, axisThick, axisThick);
  let geometry2 = new THREE.BoxGeometry(axisThick, axisSize, axisThick);
  let geometry3 = new THREE.BoxGeometry(axisThick, axisThick, axisSize);
  let geometry4 = new THREE.BoxGeometry(nvThick, radius, nvThick);
  //Especifique o material em um array (para 6 lados porque tem formato de caixa)
  let materials1 = [
    new THREE.MeshLambertMaterial({color: 0xff0000}),
    new THREE.MeshLambertMaterial({color: 0xcc0000}),
    new THREE.MeshLambertMaterial({color: 0x990000}),
    new THREE.MeshLambertMaterial({color: 0xffcccc}),
    new THREE.MeshLambertMaterial({color: 0xff9999}),
    new THREE.MeshLambertMaterial({color: 0xff6666})
  ];
  let materials2 = [
    new THREE.MeshLambertMaterial({color: 0x00ff00}),
    new THREE.MeshLambertMaterial({color: 0x00cc00}),
    new THREE.MeshLambertMaterial({color: 0x009900}),
    new THREE.MeshLambertMaterial({color: 0xccffcc}),
    new THREE.MeshLambertMaterial({color: 0x99ff99}),
    new THREE.MeshLambertMaterial({color: 0x66ff66})
  ];
  let materials3 = [
    new THREE.MeshLambertMaterial({color: 0x0000ff}),
    new THREE.MeshLambertMaterial({color: 0x0000cc}),
    new THREE.MeshLambertMaterial({color: 0x000099}),
    new THREE.MeshLambertMaterial({color: 0xccccff}),
    new THREE.MeshLambertMaterial({color: 0x9999ff}),
    new THREE.MeshLambertMaterial({color: 0x6666ff})
  ];
  let materials4 = [
    new THREE.MeshLambertMaterial({color: 0xccccff}),
    new THREE.MeshLambertMaterial({color: 0x9999cc}),
    new THREE.MeshLambertMaterial({color: 0x666699}),
    new THREE.MeshLambertMaterial({color: 0xccccff}),
    new THREE.MeshLambertMaterial({color: 0x9999ff}),
    new THREE.MeshLambertMaterial({color: 0x6666ff})
  ];
  let material1 = new THREE.MeshFaceMaterial(materials1);
  let material2 = new THREE.MeshFaceMaterial(materials2);
  let material3 = new THREE.MeshFaceMaterial(materials3);
  let material4 = new THREE.MeshFaceMaterial(materials4);//
  //let material4 = new THREE.MeshLambertMaterial( { color: 0x114477 } );
  
  const geometry = new THREE.SphereGeometry( pointSize, 32, 32 );
  const material = new THREE.MeshLambertMaterial( {color: 0x999999} );
  const sphere = new THREE.Mesh( geometry, material );
  sphereV = new THREE.Mesh( geometry, material );
  scene.add( sphere );
  scene.add( sphereV );
  
  //Criação de objetos
  axes = [
    new THREE.Mesh(geometry1, material1),
    new THREE.Mesh(geometry2, material2),
    new THREE.Mesh(geometry3, material3)
  ];
  normalVect = new THREE.Mesh(geometry4, material4);
  
  for(let i=0;i<axes.length;i++){
    scene.add(axes[i]);
  }
  scene.add(normalVect);
  
  const geometryP = new THREE.SphereGeometry( pointSize, 32, 32 );
  const materialP = new THREE.MeshLambertMaterial( {color: 0x999999} );
  points =[];
  
  for(let i=0;i<N;i++){
    points.push(new THREE.Mesh( geometryP, materialP ));
    scene.add(points[i]);
  }
  
  //https://ics.media/tutorial-three/points/
  //https://qiita.com/clomie/items/e5dd35dcfcba082b2a7f
  
  // Criar dados de forma
  const geometryParticles = new THREE.Geometry();
  // Alcance para colocar
  const SIZE = radius;
  for (let i = 0; i < 2000; i++) { // Repita quantas vezes quiser colocar
    let unitZ = 2*(Math.random() - 0.5);
    let radianT = Math.random()*2*Math.PI;
    let x = radius * Math.sqrt(1 - unitZ * unitZ) * Math.cos(radianT);
    let y = radius * Math.sqrt(1 - unitZ * unitZ) * Math.sin(radianT);
    let z = radius * unitZ;
    geometryParticles.vertices.push(new THREE.Vector3(x,y,z));
  }
  // Criar materiais
  const materialParticles = new THREE.PointsMaterial({
    size: 1,// cada tamanho
    color: 0x666666,  // 色
  });

  const mesh = new THREE.Points(geometryParticles, materialParticles);
  scene.add(mesh);
  
  for(let i=0;i<axes.length;i++){
    axes[i].rotation.x = 0;
    axes[i].rotation.y = 0;
    axes[i].rotation.z = 0;
  }
  
  axes[0].position.x = axisSize/2;
  axes[0].position.y = 0;
  axes[0].position.z = 0;
  
  axes[1].position.x = 0;
  axes[1].position.y = axisSize/2;
  axes[1].position.z = 0;
  
  axes[2].position.x = 0;
  axes[2].position.y = 0;
  axes[2].position.z = axisSize/2;
  
  updateCameraPos();
  calcNormalVectorPosition();
  redraw();
}

function redraw() {
  renderer.render(scene, camera); // Renderização
}

function removeTorusMesh() {
  scene.remove( torus );
  geometryT.dispose();
  materialT.dispose();
}

function updateTorusMesh(angle) {
  if (torus!==0) {
    removeTorusMesh();
  }
  
  geometryT = new THREE.TorusGeometry( radius*Math.sin(angle), orbitThick, 16, 100 );
  materialT = new THREE.MeshLambertMaterial( { color: 0x114477 } );
  //testar
  //const geometryT = new THREE.PlaneGeometry(radius, radius, 1, 1);
  //const materialT = new THREE.MeshBasicMaterial( {color: 0x114477, side: THREE.DoubleSide} );
  //
  torus = new THREE.Mesh( geometryT, materialT );
  scene.add( torus );
}


function calcNormalVectorPosition(){
  let theta1 =  2*Math.PI*nvTheta1.value/360;
  let theta2 =  2*Math.PI*nvTheta2.value/360;
  sphereV.position.x = radius*Math.sin(theta1);
  sphereV.position.y = radius*Math.cos(theta1)*Math.cos(theta2);
  sphereV.position.z = radius*Math.cos(theta1)*Math.sin(theta2);
  
  normalVect.position.x = sphereV.position.x/2;
  normalVect.position.y = sphereV.position.y/2;
  normalVect.position.z = sphereV.position.z/2;
  normalVect.rotation.x = theta2;
  normalVect.rotation.y = 0;
  normalVect.rotation.z = -theta1;
  updateUVector();
}


function updateUVector(){
  let theta1 =  2*Math.PI*nvTheta1.value/360;
  let theta2 =  2*Math.PI*nvTheta2.value/360;
  
  let angle = 2*Math.PI*uAngle.value/360;
  let cosA = Math.cos(angle);
  let sinA = Math.sin(angle);
  
  if ( angle !== oldAngle) {
  // Gere e registre novamente a malha para redimensionar
    updateTorusMesh(angle); 
    oldAngle = angle;
  }
  
  torus.position.x = cosA * sphereV.position.x;
  torus.position.y = cosA * sphereV.position.y;
  torus.position.z = cosA * sphereV.position.z;
  
  torus.rotation.x = Math.PI/2 + normalVect.rotation.x;
  torus.rotation.y = normalVect.rotation.z;
  torus.rotation.z = 0;
  
  for(let i=0;i<N;i++){
    let beta = 2*Math.PI*i/N;
    let v = [ radius*cosA, 0, radius*sinA ];
    v = mulRotMat("x", v,  beta);
    v = mulRotMat("z", v, -theta1+Math.PI/2);
    v = mulRotMat("x", v,  theta2);
    points[i].position.x = v[0];
    points[i].position.y = v[1];
    points[i].position.z = v[2];
  }
  
  redraw();
}

function normalVectorChanged(){
  calcNormalVectorPosition();
  redraw();
}

function mulRotMat(axisId,v,t){
  let c = Math.cos(t);
  let s = Math.sin(t);
  if(axisId=='x'){
    return [v[0], v[1]*c-v[2]*s, v[1]*s+v[2]*c];
  }
  else if(axisId=='y'){
    return [v[0]*c-v[2]*s, v[1], v[0]*s+v[2]*c];
  }
  else {
    return [v[0]*c-v[1]*s, v[0]*s+v[1]*c, v[2]];
  }
}
  
  

function onMouseDown(e) {
  let rect = e.target.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  
  dragStartX = x;
  dragStartY = y;
  dragStarted = true;
}

function updateCameraPos() {
  camera.position.x = 700 * Math.cos(currentAngleY)* (Math.cos(currentAngleX));
  camera.position.y = 700 * Math.sin(currentAngleY);
  camera.position.z = 700 * Math.cos(currentAngleY)* (Math.sin(currentAngleX));
  // Olhe na direção da origem
  camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function onMouseMove(e) {
  let rect = e.target.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  
  if (dragStarted) {
    let dx = x - dragStartX;
    let dy = y - dragStartY;
    currentAngleX += dx/50;
    currentAngleY += dy/50;
    if (currentAngleY > 0.45*Math.PI ) {
      currentAngleY = 0.45*Math.PI;
    }
    else if (currentAngleY < -0.45*Math.PI ){
      currentAngleY = -0.45*Math.PI;
    }
    dragStartX = x;
    dragStartY = y;
    
    updateCameraPos();
    redraw();
    // https://ics.media/tutorial-three/camera_position/
  }
}
function onMouseUp(e) {
  dragStarted = false;
}
function onMouseOver(e) {
  dragStarted = false;
}
  ///////////////////
  
//temporizador de contagem regressiva opcional
 //Adiciona zero na frente dos números <10
function checkSecond(sec) {
  if (sec < 10 && sec >= 0) {
    sec = "0" + sec;
  }
  if (sec < 0) {
    sec = "59";
  }
  return sec;
}

const startTimer = function () {
  const presentTime = timer.innerHTML;
  const timeArray = presentTime.split(/[:]+/);
  let m = timeArray[0];
  let s = checkSecond(timeArray[1] - 1);

  if (s == 59) {
    m = m - 1;
  }
  if (m < 0) {
    timesUp.style.display = "block";
  }

  timer.innerHTML = m + ":" + s;

  setTimeout(startTimer, 1000);
};

// Inicia ou para o embaralhamento do nome ao clicar no botão
startButton.addEventListener('click', function () {
  this.style.display = "none";
  stopButton.style.display = "block";
  intervalHandle = setInterval(function () {
    headerNames.textContent = namesList[i++ % namesList.length];
  }, 300);
  if (showTimer === true) {
    timerWrapper.classList.remove('visible');
  }
});
stopButton.addEventListener('click', function () {
  this.style.display = "none";
  startButton.style.display = "block";
  clearInterval(intervalHandle);
  timer.innerHTML = time;
  if (showTimer === true) {
    timerWrapper.classList.add('visible');
  }
  startTimer();
});

// Permitir o uso da barra de espaço para iniciar/parar o embaralhamento de nomes
document.body.onkeyup = function (e) {
  if (e.keyCode == 32) {
    if (x % 2 === 0) {
      startButton.style.display = "none";
      stopButton.style.display = "block";
      intervalHandle = setInterval(function () {
        headerNames.textContent = namesList[i++ % namesList.length];
      }, 50);
      if (showTimer === true) {
        timerWrapper.classList.remove('visible');
      }
    } else {
      startButton.style.display = "block";
      stopButton.style.display = "none";
      clearInterval(intervalHandle);
      timer.innerHTML = time;
      if (showTimer === true) {
        timerWrapper.classList.add('visible');
      }
      startTimer();
    }
    x++;
  }
};

// Aviso piscando
var backgroundInterval = setInterval(function () {
  //timesUp.classList.toggle("backgroundRed");
}, 1000);


