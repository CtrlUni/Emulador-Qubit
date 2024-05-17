"use strict";

// Mude para false se você não quiser um timer
const showTimer = true;

// Defina o tempo de contagem regressiva do cronômetro aqui em minutos: formato de segundos
const time = 0 + ":" + 19;

//Adicione a lista de nomes aqui
const namesList = [
'A',
'B',
'C',
'D',
'E',
'F',
'G'];


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
  }, 50);
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
  timesUp.classList.toggle("backgroundRed");
}, 1000);
