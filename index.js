//TODO :
/*
Timer
ctrl + click sur chiffre, ouvre tout autour
ctrl affiche les voisins
messages de victoire ou de défaite
*/
const grid_pixels = 500
const grid_size = 15
const cell_size = grid_pixels / grid_size

const grid = document.getElementById('grid')

const nb_mines = document.getElementById('mines_range')
nb_mines.max = Math.min(nb_mines.max, Math.floor(grid_size * grid_size / 3))
nb_mines.value = Math.min(nb_mines.value, Math.floor(grid_size * grid_size / 3))

const text_nb_mines = document.getElementById('nb_mines')
text_nb_mines.textContent = nb_mines.value
nb_mines.oninput = () => text_nb_mines.textContent = nb_mines.value


var nb_mines_restantes = 0
const nb_mines_act = document.getElementById('nb_mines_act')
nb_mines_act.innerHTML = nb_mines_restantes

const start = document.getElementById('start')

var first_click = false

const create_cell_grid = () => {
    grid.innerHTML = ""
    for(let i = 0; i < grid_size; i++) {
        row = []
        for (let j = 0; j< grid_size; j++) {
            const c = cell(i,j)
            grid.appendChild(c)
            row.push(c)
        }
        cell_grid.push(row)
    }
}

var play_grid = []
var cell_grid = []
var list_mines = []
var lost = false

start.onclick = () => {
    nb_mines_restantes = nb_mines.value
    nb_mines_act.innerHTML = nb_mines_restantes
    first_click = false
    lost = false
    cell_grid = []
    create_cell_grid()
    list_mines = []
    play_grid = []
}

const bombIcon = (cell, color) => {
    const bomb = document.createElement("i")
    bomb.className = "fa-solid fa-bomb " + color
    cell.appendChild(bomb)
}

const flagIcon = (cell) => {
    const flag = document.createElement("i")
    flag.className = "fa-solid fa-flag purple"
    cell.appendChild(flag)
}

var ctrl = false;

document.onkeydown = function (e) {
    e = e || window.event;
    if(e.key === "Control") {
        ctrl = e.ctrlKey
        hovered.className += " hovered"
    }
}

document.onkeyup = function (e) {
    e = e || window.event;
    if(e.key === "Control") ctrl = e.ctrlKey
}

const questionIcon = (cell) => {
    const question = document.createElement("i")
    question.className = "fa-solid fa-question blue"
    cell.appendChild(question)
}

const clear_neighbors = (x, y) => {
    let n = getNeighbors(x,y)
    for(let i = 0; i < n.length; i++) {
        let [cell, j, k] = n[i]
        if(cell.value != "revealed") {
            verif(j, k, cell)
        }
    }
}

const verif = (x, y, cell) => {
    let value = play_grid[x][y] 
    if(value != "x") {
        cell.className = "revealed"
        cell.value = "revealed"
        cell.textContent = value === 0 ? "" : value
        if(value === 0) {
            clear_neighbors(x, y)
        }
    }else {
        for(let i = 0; i < list_mines.length; i ++ ){
            let [x, y] = list_mines[i]
            console.log(cell_grid);
            let cell = cell_grid[x][y]
            let color = "red"
            if(cell.value === "flagged") color = "purple"
            cell.innerHTML = ""
            bombIcon(cell, color)
        }
        lost = true

    }
}

const getRandom = (min, max) => Math.floor(Math.random() * (max - min) + min)

const createGrid = (x, y) => {
    var possibles_position = []
    for(let i = 0; i < grid_size; i++) {
        let row = []
        for(let j = 0; j < grid_size; j++) {
            if(Math.abs(x - i) > 1 || Math.abs(y - j) > 1){
                possibles_position.push(i + " " + j)
            }
            row.push(0)
        }
        play_grid.push(row)
    }

    for (let i = 0; i < nb_mines_restantes; i++) {
        let id = getRandom(0, possibles_position.length)
        let [x, y] = possibles_position.splice(id, 1)[0].split(" ")
        x = Number(x)
        y = Number(y)
        list_mines.push([x,y])
        for(let j = Math.max(x-1, 0); j < Math.min(x+2, grid_size); j ++) {
            for(let k = Math.max(y-1, 0); k < Math.min(y+2, grid_size); k ++){
                if(j === x && k === y) {
                    play_grid[j][k] = "x"
                }else {
                    if(play_grid[j][k] != "x" ) {
                        play_grid[j][k] += 1
                    }
                }
            }
        }
    }
}

const getNeighbors = (x, y) => {
    let neighbors = []
    for(let j = Math.max(x-1, 0); j < Math.min(x+2, grid_size); j ++) {
        for(let k = Math.max(y-1, 0); k < Math.min(y+2, grid_size); k ++){
            if(j != x || k != y) {
                let cell = cell_grid[j][k]
                neighbors.push([cell, j, k])
            }
        }
    }
    return neighbors
} 

let hovered = null

const cell = (x, y) => {
    const cell_div = document.createElement("div")
    cell_div.id = x + " " + y
    cell_div.className = "cell"
    cell_div.style.width = (cell_size - 2) + "px"
    cell_div.style.height = (cell_size - 2) + "px"
    cell_div.style.left = (x * cell_size) + "px"
    cell_div.style.top = (y * cell_size) + "px"
    cell_div.onmousedown = (ev) => {
        if(lost) return 
        if(cell_div.value === "revealed") {

        } else {

            if(ev.button === 0 && cell_div.value != "flagged"){
                
                if(!first_click) {
                    first_click = true
                    createGrid(x, y)
                }
                
                verif(x, y, cell_div)
            }else if(ev.button === 2){
                if(cell_div.value != "flagged") {
                    cell_div.innerHTML = ""
                    flagIcon(cell_div);
                    cell_div.value = "flagged" 
                nb_mines_restantes -- 
            }else {
                cell_div.innerHTML = ""
                cell_div.value = "" 
                nb_mines_restantes ++ 
            }
            nb_mines_act.innerHTML = nb_mines_restantes
            }else if(ev.button === 1 && cell_div.value != "flagged") {
                if(cell_div.value != "question") {
                    questionIcon(cell_div)
                    cell_div.value = "question" 
                }else {
                    cell_div.innerHTML = ""
                    cell_div.value = "" 
                }
            }
        }
    }

    cell_div.onmouseover = (ev) => {
        hovered = cell_div
    }

    return cell_div
}