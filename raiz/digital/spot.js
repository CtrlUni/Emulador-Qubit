function Spot(i, j) { //O objeto Spot
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.i = i; //índice de grade para colunas
    this.j = j; //índice de grade para linhas
    this.neighbours = []; // and array to hold the surrounding Spots

    // "anterior" será eventualmente usado para determinar a quem se conectar novamente se
    // esse Spot acaba ficando no caminho do "início" ao "fim"
    this.previous = undefined;
    this.wall = false; // este Spot é uma parede??

    if (random(1) < 0.47) { // cria aleatoriamente alguns Spots nas paredes
        this.wall = true;
    }

    this.show = function(col) { //renderiza este Spot na tela
        fill(col);
        if (this.wall) {
            fill(color(0));
        }
        noStroke();
        rect(this.i * w + 1, this.j * h + 1, w - 2, h - 2);
    }

    this.addNeighbours = function(grid) { //encontra todos os Spots ao redor
        this.i = i;
        this.j = j;

        // isso é apenas por conveniência, então não preciso
		//ficar digitando "this.neighbours"
        var tn = this.neighbours;
        if (i < cols - 1) { // acima
            tn.push(grid[i + 1][j]);
        }
        if (i > 0) { // abaixo
            tn.push(grid[i - 1][j]);
        }
        if (j < rows - 1) { // direita
            tn.push(grid[i][j + 1]);
        }
        if (j > 0) { // esquerda
            tn.push(grid[i][j - 1]);
        }
        //diagonal
        if (i > 0 && j > 0) { // acima à esquerda
            tn.push(grid[i - 1][j - 1]);
        }
        if (i > 0 && j < rows - 1) { //acima à direita
            tn.push(grid[i - 1][j + 1]);
        }
        if (i < cols - 1 && j > 0) { // abaixo à esquerda
            tn.push(grid[i + 1][j - 1]);
        }
        if (i < cols - 1 && j < rows - 1) { // abaixo à direita
            tn.push(grid[i + 1][j + 1]);
        }
    }
}
