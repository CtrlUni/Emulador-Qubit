document.getElementById("Hidenews").style.display = "none";
document.getElementById("tab1").className = "highlight";
document.getElementById("header").innerHTML = "Crafts";

//Set classes and page ^ v
document.getElementById("tab1").addEventListener("click", highlight1);
document.getElementById("tab2").addEventListener("click", highlight2);
document.getElementById("tab3").addEventListener("click", highlight3);

//What happens when you click on tab 1:
function highlight1() {
  document.getElementById("Hide1").style.display = "";
  document.getElementById("tab1").className = "highlight";
  document.getElementById("tab2").className = "none";
  document.getElementById("tab3").className = "none";
  document.getElementById("header").innerHTML = "Deep Learning";
  document.getElementById("toChange").innerHTML =
    "Here are some fun crafts you might want to try out:";
  document.getElementById("Hidenews").style.display = "none";
}	
//What happens when you click on tab 2:
function highlight2() {
  document.getElementById("Hide1").style.display = "none";
  document.getElementById("tab2").className = "highlight";
  document.getElementById("tab1").className = "none";
  document.getElementById("tab3").className = "none";
  document.getElementById("header").innerHTML = "Machine learning";
  document.getElementById("toChange").innerHTML =
    "Isso é o que está acontecendo por aqui.";
  document.getElementById("Hidenews").style.display = "";
  var crafts = ["Name tag", "Personal bag"];
  switch (new Date().getDay) {
    case 0:
      document.getElementById("craftOfDay").innerHTML =
        "The craft of the day is :" + Math.floor(Math.random() * crafts.length);
      break;
    case 1:
      document.getElementById("craftOfDay").innerHTML =
        "The craft of the day is :" + Math.floor(Math.random() * crafts.length);
      break;
    case 2:
      document.getElementById("craftOfDay").innerHTML =
        "The craft of the day is :" + Math.floor(Math.random() * crafts.length);
      break;
      case 3:
            document.getElementById("craftOfDay").innerHTML = "The craft of the day is :" + Math.floor(Math.random() * crafts.length);
      break;
      case 4:
            document.getElementById("craftOfDay").innerHTML = "The craft of the day is :" + Math.floor(Math.random() * crafts.length);
      break;
      case 5:
            document.getElementById("craftOfDay").innerHTML = "The craft of the day is :" + Math.floor(Math.random() * crafts.length);
      break;
      case 6:
            document.getElementById("craftOfDay").innerHTML = "The craft of the day is :" + Math.floor(Math.random() * crafts.length);
      break;
  }
}
//What happens when you click on tab 3:
function highlight3() {
  document.getElementById("Hide1").style.display = "none";
  document.getElementById("tab3").className = "highlight";
  document.getElementById("tab1").className = "none";
  document.getElementById("tab2").className = "none";
  document.getElementById("header").innerHTML = "Computação quântica";
  document.getElementById("toChange").innerHTML =
    "Computadores convencionais, provessam dados digitais, representados por bit 0 e 1<br /><br /><br /><br /><br /><br />";
  document.getElementById("Hidenews").style.display = "none";
}
