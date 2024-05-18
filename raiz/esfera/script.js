window.addEventListener("load", windowLoadHandler, false);
var sphereRad = 250;
var radius_sp=1;
var opt_display_dots = false;
var bit = 0;
const Tx ='O';
const frio ='0/1';
const quente= '3';
const normal = '1';
var unicodeFlakes = [Tx,bit,quente,frio];//'❄', '❅', '❆', '❄', '❅', '❆', '❄', '❅', '❆', '❄', '❅', '❆', '❄', '❅', '❆', '我', '載', '火', '的', '山', '首', '页', '鍺', '是', '種', '化', '學', '化', '學', '符', '號', '是', '原', '子', '序', '數', '是', '它', '是', '種', '灰', '白', '色', '類', '金', '屬', '有', '光', '澤', '質', '硬', '屬', '於', '碳', '族', '化', '學', '性', '質', '與', '同', '族', '的', '錫', '與', '矽', '相', '共', '有', '五', '種', '同', '位', '素', '❄', '❅', '❆', '❄', '❅', '❆', '❄', '❅', '❆', '❄', '❅', '❆', '❅', '❆', '才', '菜', '参', '餐', '层', '茶', '差', '长', '常', '场', '唱', '超', '车', '成', '城', '程', '吃', '店', '定', '订', '丢', '东', '冬', '懂', '动', '都', '读', '独', '度', '短', '对', '多', '饿', '儿', '而', '发', '法', '反', '饭', '方', '房', '放', '飞', '非', '费', '分', '份', '风', '封', '夫', '服', '附', '父', '复', '该', '改', '干', '感', '刚', '高', '告', '哥', '歌', '格', '个', '给', '号', '喝', '和', '河', '贺', '黑', '很', '红', '后', '候', '湖', '护', '花', '化', '画', '话', '坏', '欢', '还', '换', '黄', '回', '会', '婚', '活', '火', '或', '机', '鸡', '级', '极', '急', '际', '济', '继', '寄', '加', '家', '假', '价', '力', '历', '丽', '联', '凉', '两', '亮', '谅', '辆', '了', '林', '零', '六', '楼', '路', '录', '旅', '妈', '马', '码', '吗', '买', '卖', '满', '慢', '忙', '猫', '毛', '贸', '么', '没', '每', '美', '妹', '米', '面', '民', '明', '末', '母', '目', '拿', '哪', '那', '奶', '男', '南', '难', '脑', '呢', '能', '你', '年', '念', '鸟', '您', '牛', '农', '努', '女', '暖', '欧', '怕', '乓', '旁', '胖', '跑', '朋', '片', '漂', '票', '乒', '平', '期', '其', '奇', '骑', '起', '气', '汽', '千', '前', '签', '轻', '清', '情', '请', '秋', '球', '区', '取', '去', '趣', '全', '然', '让', '首', '售', '书', '术', '树', '双', '谁', '水', '睡', '说', '司', '思', '死', '四', '送', '诉', '算', '虽', '岁', '孙', '所', '他', '她', '它', '台', '太', '谈', '汤', '堂', '套', '特', '踢', '提', '题', '体', '天', '填', '条', '铁', '听', '厅', '庭', '通', '同', '头', '图', '外', '玩', '完', '晚', '万', '王', '网', '往', '忘', '望', '卫', '为', '位', '文', '我', '卧', '五', '午', '务', '物', '西', '吸', '希', '息', '习', '牙', '亚', '烟', '言', '羊', '阳', '样', '药', '要', '也', '业', '夜', '一', '衣', '医', '已', '以', '易', '意', '因', '音', '印', '银', '应', '英', '影', '硬', '用', '邮', '油', '游', '友', '有', '又', '右', '鱼', '愉', '雨', '语', '元', '员', '园', '原', '远', '院', '愿', '月', '在', '早', '怎', '张', '找', '照', '者', '这', '真', '正', '证', '知', '只', '之', '直', '止', '纸', '至', '治', '中', '钟', '种', '重', '周', '洲', '主', '住', '助', '祝', '注', '专', '准' ];

//para mensagens de depuração
var Debugger = function() { };
Debugger.log = function(message) {
	try {
		console.log(message);
	}
	catch (exception) {
		return;
	}
}

function windowLoadHandler() {
	canvasApp();
}

function canvasSupport() {
	return Modernizr.canvas;
}

function canvasApp() {
	if (!canvasSupport()) {
		return;
	}
	
	var theCanvas = document.getElementById("canvasOne");
	var context = theCanvas.getContext("2d");
	
	var displayWidth;
	var displayHeight;
	var timer;
	var wait;
	var count;
	var numToAddEachFrame;
	var particleList;
	var recycleBin;
	var particleAlpha;
	var r,g,b;
	var fLen;
	var m;
	var projCenterX;
	var projCenterY;
	var zMax;
	var turnAngle;
	var turnSpeed;
	var sphereCenterX, sphereCenterY, sphereCenterZ;
	var particleRad;
	var zeroAlphaDepth;
	var randAccelX, randAccelY, randAccelZ;
	var gravity;
	var rgbString;
	//estamos definindo globalmente muitas variáveis 
	//​​usadas nas funções de atualização de tela para 
	//que elas não precisem ser redefinidas a cada quadro.
	var p;
	var outsideTest;
	var nextParticle;
	var sinAngle;
	var cosAngle;
	var rotX, rotZ;
	var depthAlphaFactor;
	var i;
	var theta, phi;
	var x0, y0, z0;
		
	init();
	
  // INICIALMENTE
	function init() {
		wait = 1;
		count = wait - 1;
		numToAddEachFrame = 4;
		
		//cor da partícula
		r = 70;
		g = 255;
		b = 140;
		//string parcial para cor que será 
		//completada anexando o valor alfa.
		rgbString = "rgba("+r+","+g+","+b+","; 
		particleAlpha = 1; //alfa máximo
		
		displayWidth = theCanvas.width;
		displayHeight = theCanvas.height;
		
		fLen = 250; //represents the distance from the viewer to z=0 depth.
		
		//coordenadas do centro de projeção definem a localização da origem
		projCenterX = displayWidth/2;
		projCenterY = displayHeight/2;
		
		//não desenharemos coordenadas se elas
		//tiverem uma coordenada z muito grande 
		//(o que significa que estão muito próximas do observador).
		zMax = fLen-2;
		
		particleList = {};
		recycleBin = {};
		
		//fatores de aceleração aleatórios 
		//- causa algum movimento aleatório
		randAccelX = 0.1;
		randAccelY = 0.1;
		randAccelZ = 0.1;
		
		//tente mudar para um número positivo 
		//(não muito grande, por exemplo 0,3) ou 
		//negativo para flutuar para cima.
		gravity = -0; 
		
		particleRad = 2.5;
		
		sphereCenterX = 0;
		sphereCenterY = 0;
		sphereCenterZ = -3 - sphereRad;
		
		//os valores alfa diminuirão à medida 
		//que as partículas se movem para trás,
		//causando escurecimento baseado em profundidade:
		zeroAlphaDepth = -750; 
		//a esfera irá girar nesta velocidade
        //(uma rotação completa a cada 1600 frames).
		turnSpeed = 2*Math.PI/1200; 
		turnAngle = 0; //ângulo inicial
		
		timer = setInterval(onTimer, 10/24);
	}
	
	function onTimer() {
		//se tiver decorrido tempo suficiente, 
		//adicionaremos novas partículas.
		count++;
			if (count >= wait) {
						
			count = 0;
			for (i = 0; i < numToAddEachFrame; i++) {
				theta = Math.random()*2*Math.PI;
				phi = Math.acos(Math.random()*2-1);
				x0 = sphereRad*Math.sin(phi)*Math.cos(theta);
				y0 = sphereRad*Math.sin(phi)*Math.sin(theta);
				z0 = sphereRad*Math.cos(phi);
				
				//Usamos a função addParticle para adicionar 
				//uma nova partícula.  Os parâmetros definem 
				//os componentes de posição e velocidade.
                //Observe que os parâmetros de velocidade 
				//farão com que a partícula voe inicialmente 
				//para fora do centro da esfera (após
                //ele fica solto).
				var p = addParticle(x0, sphereCenterY + y0, sphereCenterZ + z0, 0.002*x0, 0.002*y0, 0.002*z0);
				
				//definimos alguns parâmetros de "envelope" 
				//que controlarão o alfa evolutivo das partículas.
				p.attack = 1;
				p.hold = 50;
				p.decay = 100;
				p.initValue = 0;
				p.holdValue = particleAlpha;
				p.lastValue = 0;
				
				//a partícula ficará presa em um 
				//lugar até que esse tempo tenha decorrido:
				p.stuckTime = 90 + Math.random()*20;
				
				p.accelX = 0;
				p.accelY = gravity;
				p.accelZ = 0;
			}
		}
		
		//atualiza o ângulo de visão
		turnAngle = (turnAngle + turnSpeed) % (2*Math.PI);
		sinAngle = Math.sin(turnAngle);
		cosAngle = Math.cos(turnAngle);

		//preenchimento de fundo
		context.fillStyle = "#000000";
		context.fillRect(0,0,displayWidth,displayHeight);
		
		//atualiza e desenha partículas
		p = particleList.first;
		while (p != null) {
			//antes da lista ser alterada grava a 
			//próxima partícula
			nextParticle = p.next;

			//atualiza a idade
			p.age++;
			
			//se a partícula já passou do tempo de 
			//"trava", ela começará a se mover.
			if (p.age > p.stuckTime) {	
				p.velX += p.accelX + randAccelX*(Math.random()*2 - 1);
				p.velY += p.accelY + randAccelY*(Math.random()*2 - 1);
				p.velZ += p.accelZ + randAccelZ*(Math.random()*2 - 1);
				
				p.x += p.velX;
				p.y += p.velY;
				p.z += p.velZ;
			}
			
			/*
            Estamos fazendo duas coisas aqui para 
			calcular as coordenadas de exibição.
            Toda a exibição está sendo girada em torno 
			de um eixo vertical, então primeiro calculamos 
			as coordenadas giradas para
            x e z (mas a coordenada y não mudará).
            Em seguida, pegamos as novas coordenadas (rotX, y, rotZ)
			//e as projetamos no plano de visualização 2D.
            */
			rotX =  cosAngle*p.x + sinAngle*(p.z - sphereCenterZ);
			rotZ =  -sinAngle*p.x + cosAngle*(p.z - sphereCenterZ) + sphereCenterZ;
			m =radius_sp* fLen/(fLen - rotZ);
			p.projX = rotX*m + projCenterX;
			p.projY = p.y*m + projCenterY;
			
			//atualiza o alfa de acordo com os parâmetros do envelope.
			if (p.age < p.attack+p.hold+p.decay) {
				if (p.age < p.attack) {
					p.alpha = (p.holdValue - p.initValue)/p.attack*p.age + p.initValue;
				}
				else if (p.age < p.attack+p.hold) {
					p.alpha = p.holdValue;
				}
				else if (p.age < p.attack+p.hold+p.decay) {
					p.alpha = (p.lastValue - p.holdValue)/p.decay*(p.age-p.attack-p.hold) + p.holdValue;
				}
			}
			else {
				p.dead = true;
			}
			
			//ver se a partícula ainda está dentro do intervalo visível.
			if ((p.projX > displayWidth)||(p.projX<0)||(p.projY<0)||(p.projY>displayHeight)||(rotZ>zMax)) {
				outsideTest = true;
			}
			else {
				outsideTest = false;
			}
			
			if (outsideTest||p.dead) {
				recycle(p);
			}
			
			else {
				//escurecimento dependente da profundidade
				depthAlphaFactor = (1-rotZ/zeroAlphaDepth);
				depthAlphaFactor = (depthAlphaFactor > 1) ? 1 : ((depthAlphaFactor<0) ? 0 : depthAlphaFactor);
				context.fillStyle = rgbString + depthAlphaFactor*p.alpha + ")";
        /*função ADICIONAR TEXTO!*/
         /*função ADICIONAR TEXTO!*/
         /*função ADICIONAR TEXTO!*/
         /*função ADICIONAR TEXTO!*/
				context.fillText(p.flake,p.projX, p.projY);
        /*ADD TEXT function!*/
        /*ADD TEXT function!*/
        /*ADD TEXT function!*/
        /*ADD TEXT function!*/
				//draw
				context.beginPath();
        if(opt_display_dots)
          {context.arc(p.projX, p.projY, m*particleRad, 0, 2*Math.PI, false);}
				context.closePath();
				context.fill();
			}
			
			p = nextParticle;
		}
	}
		
	function addParticle(x0,y0,z0,vx0,vy0,vz0) {
		var newParticle;
		var color;
    
		
		//verifica a lixeira para ver se há itens disponíveis:
		if (recycleBin.first != null) {
			newParticle = recycleBin.first;
			//remove da lixeira
			if (newParticle.next != null) {
				recycleBin.first = newParticle.next;
				newParticle.next.prev = null;
			}
			else {
				recycleBin.first = null;
			}
		}
		//se a lixeira estiver vazia, cria uma 
	    //nova partícula (um novo objeto vazio):
		else {
			newParticle = {};
		}
		
		//adiciona ao início da lista de partículas
		if (particleList.first == null) {
			particleList.first = newParticle;
			newParticle.prev = null;
			newParticle.next = null;
		}
		else {
			newParticle.next = particleList.first;
			particleList.first.prev = newParticle;
			particleList.first = newParticle;
			newParticle.prev = null;
		}
		
		//inicializar
		newParticle.x = x0;
		newParticle.y = y0;
		newParticle.z = z0;
		newParticle.velX = vx0;
		newParticle.velY = vy0;
		newParticle.velZ = vz0;
		newParticle.age = 0;
		newParticle.dead = false;
    
    newParticle.flake = unicodeFlakes[Math.floor(Math.random() * unicodeFlakes.length)];
		if (Math.random() < 0.5) {
			newParticle.right = true;
		}
		else {
			newParticle.right = false;
		}
		return newParticle;		
	}
	
	function recycle(p) {
		//remove da lista de partículas
		if (particleList.first == p) {
			if (p.next != null) {
				p.next.prev = null;
				particleList.first = p.next;
			}
			else {
				particleList.first = null;
			}
		}
		else {
			if (p.next == null) {
				p.prev.next = null;
			}
			else {
				p.prev.next = p.next;
				p.next.prev = p.prev;
			}
		}
		//adiciona à lixeira
		if (recycleBin.first == null) {
			recycleBin.first = p;
			p.prev = null;
			p.next = null;
		}
		else {
			p.next = recycleBin.first;
			recycleBin.first.prev = p;
			recycleBin.first = p;
			p.prev = null;
		}
	}	
}


$(function() {
    $( "#slider-range" ).slider({
      range:false,
      min: 0,
      max: 500,
      value: 280,
      slide: function( event, ui ) {
         console.log(ui.value);
        sphereRad = ui.value;
      }
    });
  });

$(function() {
    $( "#slider-test" ).slider({
      range:false,
      min: 1.0,
      max: 2.0,
      value: 1,
      step:0.01,
      slide: function( event, ui ) {
        radius_sp = ui.value;
      }
    });
  });
