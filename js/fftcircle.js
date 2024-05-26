//https://www.youtube.com/watch?v=LznjC4Lo7lE

var i, t, animation = 'stop',
    fourier = $('canvas#fourier'),
    canvas = fourier[0],
    ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 250;

ctx.lineCap = 'round';  
ctx.lineJoin = 'round';  

var grid1 = {
  l: 30, t: 15,
  x: 20, y: 20,
  w: 200, h: 200,
  cx: 2.5, cy: 2.5,
  comprimento: 0.5, sy: 0.5
};
var grid2 = {
  l: 270, t: grid1.t,
  x: Math.PI*10, y: grid1.y,
  w: 300, h: grid1.h,
  cx: 0, cy: grid1.cy,
  comprimento: 2, sy: grid1.sy,
  last: true,
  alpha: 1
};
var velocidade = 0.01*Math.PI,
    ad = 0.025;

var drawGrid = function (o) {
  ctx.beginPath();
  //horizontal
  ctx.textAlign = 'right';
  for (i=0; i<=(o.h/o.y); i++) {
    ctx.moveTo(      o.l, Math.round((o.y * i) + o.t) + 0.5);
    ctx.lineTo(o.w + o.l, Math.round((o.y * i) + o.t) + 0.5);    
    ctx.fillText(  Math.round(((-i * o.sy) + o.cy)*10)/10, 
                 o.l - 5, 
                 (i * o.y) + o.t + 5
    );
  }
  //vertical
  ctx.textAlign = 'center';
  for (i=0; i<=(o.w/o.x); i++) {
    ctx.moveTo( Math.round((o.x * i) + o.l) + 0.5,       o.t);
    ctx.lineTo( Math.round((o.x * i) + o.l) + 0.5, o.h + o.t); 
    ctx.fillText( Math.round(((-i * o.comprimento) + o.cx) * -10)/10, 
                 (i * o.x) + o.l, 
                 o.t + o.h + 15
    );
  }
  if (o.last) {
    ctx.moveTo( o.w + o.l + 0.5,       o.t);
    ctx.lineTo( o.w + o.l + 0.5, o.h + o.t);
  }
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';  
  ctx.stroke();  
};

var drawGrids = function () {
  drawGrid(grid1);
  drawGrid(grid2);
};

var circles = [
  {x: 0, y: 0, a: 0, data: [], r: 4/Math.PI,     c: 'royalblue'},
  {x: 0, y: 0, a: 0, data: [], r: 4/(Math.PI*3), c: 'tomato'},
  {x: 0, y: 0, a: 0, data: [], r: 4/(Math.PI*5), c: 'limegreen'},
  {x: 0, y: 0, a: 0, data: [], r: 4/(Math.PI*7), c: 'darkslategray'}
];

var drawCircle = function (i, o) {
  var circle = circles[i];
  ctx.beginPath();
  ctx.arc(
    o.l + ((circle.x + o.cx) * o.x / o.comprimento), 
    o.t + ((circle.y + o.cy) * o.y / o.sy), 
    circle.r * o.x / o.comprimento, 0, Math.PI*2);
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.strokeStyle = circle.c;
  ctx.stroke();
};

var drawClockLine = function (i, o, ext) {
  var circle = circles[i];
  ctx.beginPath();
  var r = {
    x: circle.r * Math.cos(circle.a),
    y: circle.r * Math.sin(circle.a)
  };
  ctx.moveTo(
    o.l + ((circle.x + o.cx) * o.x / o.comprimento), 
    o.t + ((circle.y + o.cy) * o.y / o.sy));
  ctx.lineTo(
    o.l + ((circle.x + o.cx + r.x) * o.x / o.comprimento), 
    o.t + ((circle.y + o.cy + r.y) * o.y / o.sy));
  ctx.arc(
    o.l + ((circle.x + o.cx + r.x) * o.x / o.comprimento), 
    o.t + ((circle.y + o.cy + r.y) * o.y / o.sy), 
    1.5, 0, Math.PI*2);
  ctx.lineWidth = 1.5;    
  ctx.strokeStyle = circle.c;
  ctx.setLineDash([]);
  ctx.stroke();
  if (ext) {
    ctx.beginPath();
    ctx.moveTo(
      o.l + ((circle.x + o.cx + r.x) * o.x / o.comprimento), 
      o.t + ((circle.y + o.cy + r.y) * o.y / o.sy));
    var n = circle.data.length;
    ctx.lineTo(
      grid2.l + (((n + grid2.cx) * grid2.x * ad / grid2.comprimento)), 
      grid2.t + ((circle.y + grid2.cy + r.y) * grid2.y / grid2.sy));
    ctx.setLineDash([4,3]);
    ctx.stroke();    
  }
  circle.data.push(circle.y + r.y);
};

var drawWave = function (i, o) {
  var circle = circles[i],
      n = circle.data.length,
      j = circle.data[n-1];
  ctx.beginPath();
  ctx.arc(
    o.l + (((n + o.cx) * o.x * ad / o.comprimento)), 
    o.t + ((j + o.cy) * o.y / o.sy),
    1.5, 0, Math.PI*2);
  ctx.lineWidth = 1.5;    
  ctx.strokeStyle = circle.c;
  ctx.setLineDash([]);
  ctx.stroke();
  ctx.beginPath();
  for (i=0; i<n; i++) {
    j = circle.data[i];    
    ctx.lineTo(
      o.l + (((i + o.cx) * o.x * ad / o.comprimento)),
      o.t + ((j + o.cy) * o.y / o.sy));    
  }
  ctx.lineWidth = 0.6;   
  ctx.strokeStyle = circle.c;
  
  ctx.setLineDash([]);
  ctx.stroke();
};

var rotateCircle = function (i, o, d) {  
  var circle = circles[i];
  circle.x = d.x + d.r * Math.cos(d.a);
  circle.y = d.y + d.r * Math.sin(d.a);
};

var  centralizado = function () {
  ctx.clearRect(0,0,canvas.width, canvas.height);
  drawGrids(); 
  for (i=0; i<circles.length; i++) {
    drawCircle(i, grid1);
    circles[i].a -= velocidade/circles[i].r;
    drawClockLine(i, grid1, 1);
    drawWave(i, grid2);
  }
  var n = circles[0].data.length,
      x = grid2.l + ((n + grid2.cx) * grid2.x * ad / grid2.comprimento);
  if (x > grid2.l + grid2.w) {  
    animation = 'stop';
    t = setTimeout(function () {
      reset();
      animation = 'move';
    }, 2000);
  }
};

var moveCircles = function () {
  ctx.clearRect(0,0,canvas.width, canvas.height);
  drawGrids(); 
  for (i=0; i<circles.length; i++) {
    drawCircle(i, grid1);
    drawWave(i, grid2); 
  }
  circles[1].x += circles[0].r * 0.01;
  circles[2].x += (circles[0].r + circles[1].r) * 0.01;
  circles[3].x += (circles[0].r + circles[1].r + circles[2].r) * 0.01;
  if (circles[1].x > circles[0].r) {
    animation = 'stop';
    t = setTimeout(start2, 2000);
  }
};

var   normal = function () {
  ctx.clearRect(0,0,canvas.width, canvas.height);
  drawGrids(); 
  for (i=0; i<circles.length; i++) {
    drawCircle(i, grid1);       
  } 
  circles[0].a -= velocidade / circles[0].r;   
  circles[1].a -= velocidade / circles[1].r;
  circles[2].a -= velocidade / circles[2].r;
  circles[3].a -= velocidade / circles[3].r;
  drawClockLine(1, grid1);      
  drawClockLine(2, grid1);  
  drawClockLine(3, grid1, 1);
  rotateCircle(1, grid1, circles[0]);
  rotateCircle(2, grid1, circles[1]);
  rotateCircle(3, grid1, circles[2]); 
  drawWave(3, grid2);
  var n = circles[3].data.length,
      x = grid2.l + ((n + grid2.cx) * grid2.x * ad / grid2.comprimento);
  if (x > grid2.l + grid2.w) {
    animation = 'stop';
    t = setTimeout(start, 2000);
  }
};

var frame = function () {
  requestAnimationFrame(frame);
  if (animation == ' centralizado') {
     centralizado();
  }
  if (animation == 'move') {
    moveCircles();
  }
  if (animation == '  normal') {
      normal();
  }
  if (animation == 'stop') {
    grid2.alpha -= 0.01;
  }  
};

var reset = function () {
  animation = 'stop';
  clearTimeout(t);
  for (i=0; i<circles.length; i++) {
    circles[i].x = 0;
    circles[i].y = 0;
    circles[i].a = 0;
    circles[i].data = [];
  }
};

var start = function () {
  reset();
  animation = ' centralizado';
};

var start2 = function () {
  reset();  
  circles[1].x = circles[0].r;
  circles[2].x = circles[0].r + circles[1].r;
  circles[3].x = circles[0].r + circles[1].r + circles[2].r;
  animation = '  normal';
};

var gui = new dat.GUI();

gui.add(window, 'start').name(' centralizado');
gui.add(window, 'start2').name('  normal');
gui.add(window, 'velocidade', velocidade/20, velocidade*20);
gui.add(grid2, 'comprimento', grid2.comprimento, 10).listen();
gui.add(circles[0], 'r', 0.01, 1.5).name('hamonico 0');
gui.add(circles[1], 'r', 0.01, 0.5).name('hamonico 1');
gui.add(circles[2], 'r', 0.01, 0.3).name('hamonico 2');
gui.add(circles[3], 'r', 0.01, 0.2).name('hamonico 3');

frame();
start();