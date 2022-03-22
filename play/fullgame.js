/*
 #######  ######   #######   #####        ###  ####### 
    #     #     #     #     #     #        #   #       
    #     #     #     #     #              #   #       
    #     ######      #      #####         #   #####   
    #     #   #       #           #  ###   #   #       
    #     #    #      #     #     #  ###   #   #       
    #     #     #     #      #####   ###  ###  #       
                                                    
    Um projeto desenvolvido por: João Felipi Cardoso & Davi Gabriel Tomaz
*/

// configurando o canvas
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20);
// (fim) configurando o canvas

var pauseGame = false;

// Funções gerais:

// "VARRER" a arena
function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length -1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

// checar colisões
function collide(arena, player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
               (arena[y + o.y] &&
                arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

// cria o matrix => @w: width (largura) @h: heigth (altura)
function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

// cria a peça, recependo o type => @type: recebe uma letra que representa a peça (T,J,L,O,S,Z,I)
function createPiece(type)
{
    if (type === 'I') {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    } else if (type === 'L') {
        return [
            [0, 2, 0],
            [0, 2, 0],
            [0, 2, 2],
        ];
    } else if (type === 'J') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [3, 3, 0],
        ];
    } else if (type === 'O') {
        return [
            [4, 4],
            [4, 4],
        ];
    } else if (type === 'Z') {
        return [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'T') {
        return [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ];
    }
}

// desenha o matrix da peça => @matrix: objeto que esteja formatado em matrix @offset: posições fora do padrão do objeto
function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x,
                                 y + offset.y,
                                 1, 1);
            }
        });
    });
}

// desenha as coisas.
function draw() {
    context.fillStyle = '#1B2C37';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

// faz a mescla da arena com o player => @arena: matrix da arena, @player: matrix do player
function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

// rotaciona as peças e muda seus matrix => @matrix: matrix das peças, @dir: direção para onde a peça sera girada
function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }

    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

// função para pausar o jogo;
function pause(){
    pauseGame = true
    score.innerText = "PAUSE"
}

// despausa o jogo, e atualiza os updates
function unpause(){
    if(pauseGame == true){
        pauseGame = false   
        update(time=0)
        score.innerText = player.score
    }
}

// aumenta a velocidade de queda das peças
function speedUp(){

        if(player.score/10 == 0){
            dropInterval = 1000
        }
        else if(player.score/10 == 1){
            dropInterval = 800
        }
        else if(player.score/10 == 6){
            dropInterval = 600
        }
        else if(player.score/10 == 12){
            dropInterval = 500
        }
        else if(player.score/10 == 24){
            dropInterval = 300
        }
        else if(player.score/10 == 48){
            dropInterval = 200
        }
        else{
            dropInterval = dropInterval
        }
    
}


// função para resetar o jogo;
function restart(){

    player.alive = true
    arena.forEach(row => row.fill(0));
    player.score = 0;
    playerReset()

    updateScore();

    update(time=0)
}

// (fim) funções gerais


// Funções do player:

// função para fazer com que as peças caem e rode o jogo;
function playerDrop() {
    player.pos.y++;
    if (collide(arena, player) && player.alive == true) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}


// função para fazer a movimentação do player => @offset: mudança em relação a posição passada;
function playerMove(offset) {
    player.pos.x += offset;
    if (collide(arena, player)) {
        player.pos.x -= offset;
    }
}

// reset do player, cria peças e adiciona o matrix ao player
function playerReset() {
    const pieces = 'TJLOSZI';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) -
                   (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) {

        player.alive = false
        
    }
}

// lida com areceptação do comando de girar do player => @dir: direção;
function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;

function update(time = 0) {
    if(pauseGame == false && player.alive == true){

    
    const deltaTime = time - lastTime;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    lastTime = time;

    speedUp()
    draw();
    requestAnimationFrame(update);
    } else if (player.alive == false){
        score.innerText = `Fim! Seu resultado final foi de:${player.score} \n\n Pressione enter para reiniciar`
    }

}

function updateScore() {
    score = document.getElementById('score')
    score.innerText = player.score;
}

document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        playerMove(-1);
    } else if (event.keyCode === 39) {
        playerMove(1);
    } else if (event.keyCode === 40) {
        playerDrop();
    } else if (event.keyCode === 81) {
        playerRotate(-1);
    } else if (event.keyCode === 87) {
        playerRotate(1);
    } else if (event.keyCode === 80) {
        pause();
    } else if (event.keyCode === 32) {
        unpause();
    } else if(event.keyCode === 13){
        restart()
    }
});

// (fim) funções do player

export const colors = [
    null,
    '#FF0D79',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
];

const arena = createMatrix(12, 20);

export const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0,
    alive: true,
};


// iniciando o jogo:
playerReset();
updateScore();
update();




