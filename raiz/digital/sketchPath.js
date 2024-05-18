// Grid size
var camadas=16;
var bits=8;
var cols = bits;
var rows = camadas;
// 1024
var grid = new Array(cols);

// Um ​​array de Spots que não foram verificados para ver se são de fato os
// "fim" ou quão longe a heurística pensa que eles podem estar do "fim".
var openSet = [];

// Um ​​array de Spots que estavam no openSet e foram considerados não o
// melhor opção para chegar ao "fim".
var closedSet = [];
var start; // Uma var para segurar o Spot que vamos dizer que é o começo.
var end; // Uma var para conter o Spot que diremos ser o alvo/ponto final.
var path = []; // Um ​​array de Spots que estão no caminho do "início" ao "fim"

// usado para dimensionar o tamanho de cada ponto na grade ao ser exibido
var w, h;

function setup() {
    createCanvas(500, 500);
    console.log("A*");

    //define a escala
    w = width / cols;
    h = height / rows;

    // Criando um array 2D
    for (var i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i, j);
        }
    }

    // Agora encontre todos os vizinhos para cada ponto na grade
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].addNeighbours(grid);
        }
    }

    start = grid[0][0]; //define o ponto inicial
    end = grid[cols + 1][rows + 1]; // e o ponto final
	//end = grid[10][10]; // e o ponto final
    start.wall = true; // certifique-se de que o início não seja uma parede
    end.wall = true; // certifique-se de que o fim não seja uma parede

    openSet.push(start); // Prepare a bomba adicionando o start ao openSet.
}

function draw() {

    if (openSet.length > 0) { // existe alguma coisa no openSet, ou seja, desmarcada
        var winner = 0;

        // encontre o Spot com o f mais baixo e chame-o de vencedor
        for (var i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }
        // continue
        var current = openSet[winner]; // chama o Spot 'vencedor' de 'atual'
        if (current === end) { // chegamos ao fim? Se sim, então pronto!
            noLoop();
            console.log("Done!");
        }

        // então, não no 'final' e avaliamos este Spot. Retire-o do openSet
        removeFromArray(openSet, current);
        closedSet.push(current); // e adicione-o aos Spots que foram verificados

        // Vamos dar uma olhada nos vizinhos do Spot 'atual'

        // Vamos dar uma olhada nos vizinhos do Spot 'atual'
        var neighbours = current.neighbours;

        // percorre cada um dos vizinhos "atuais" do Spot
        for (var i = 0; i < neighbours.length; i++) {
            var neighbour = neighbours[i];

            // verifica se este vizinho é válido, pois ainda não foi 
			// verifica antes e não é uma parede
            if (!closedSet.includes(neighbour) && !neighbour.wall) {

                // adiciona uma "etapa" adicional ao valor g. Isso basicamente significa 
				// está um passo mais longe do ponto "inicial"
                var tempG = current.g + 1;

                // uma var para rastrear um possível novo caminho se o valor de g for melhor
                var newPath = false; // assume que o novo caminho não é melhor para começar

                // verifica se esse Spot "vizinho" está no openSet
                if (openSet.includes(neighbour)) {
                    if (tempG < neighbour.g) { // estou ficando confuso aqui.
                        neighbour.g = tempG;
                        newPath = true; // sim, caminho melhor bc inferior g
                    }
                } else {
                    neighbour.g = tempG;
                    newPath = true; // melhor porque não existia antes(?)
                    openSet.push(neighbour);
                }

                if (newPath) { // só cria novo caminho se g for melhor 
				//descobre o valor h para este vizinho usando a heurística
                    neighbour.h = heuristic(neighbour, end);

                    // soma g+h para obter o valor f para este Spot
                    neighbour.f = neighbour.g + neighbour.h;

                    // agora defina o Spot "atual" como o 'anterior' (pai) para 
					// este vizinho Spot
                    neighbour.previous = current;
                }
            }
        } // termina o loop pelo resto dos vizinhos Spot "atuais"
    } else {
        //Sem solução. Não sobrou nada no openSet. Nenhum caminho para o ponto "final"
        console.log("No Solution!"); 
		window.location.reload(); // atualiza a pagina para um nova busca
        noLoop(); //para a função de desenho
        return; // não tenho certeza para que serve isso.
    }


    background(0);

    // percorre cada ponto na grade e exibe o ponto com a
	//cor especificada
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].show(color(255));
        }
    }

    // percorre todos os pontos closedSet e pinta-os com a cor especificada (avermelhado aqui)
    for (var i = 0; i < closedSet.length; i++) {
        closedSet[i].show(color(199, 76, 123));
    }

    // percorre todos os pontos openSet e pinta-os com a cor especificada (esverdeado aqui)
    for (var i = 0; i < openSet.length; i++) {
        openSet[i].show(color(76, 199, 123));
    }

    // Agora pinte o caminho encontrado até agora 
	//cria um novo array de Spots a partir do Spot "atual" conectando de volta ao 
	// "iniciar" local
    path = [];
    var temp = current; // cria uma var 'temp' para começar a trabalhar de trás para frente
    path.push(temp); //adiciona este ponto 'temp' ao array de caminho

    // contanto que o Spot 'temp' tenha um valor para 'anterior', execute este loop
    while (temp.previous) {
        path.push(temp.previous); //adiciona o Spot em temp.previous ao array de caminho
        temp = temp.previous; // agora faça de temp.previous a nova temperatura
    }

    // percorre todos os Spots do caminho e pinta-os com a cor especificada (azulado aqui)
    for (var i = 0; i < path.length; i++) {
        path[i].show(color(76, 123, 199));
    }
}


// pequena função para remover um elemento de um array
function removeFromArray(arr, elt) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == elt) {
            arr.splice(i, 1);
        }
    }
}

// É aqui que reside o "custo" de ir do ponto a (atual) ao ponto b (o final) //está descoberto
function heuristic(a, b) {
    // var d = dist(a.i, a.j, b.i, b.j);
    var d = abs(a.i - b.i) + abs(a.j - b.j);
    return d;
}
