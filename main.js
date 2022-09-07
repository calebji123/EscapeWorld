'use strict';

// HTML elems
var display = document.getElementById("display");
var codeNum = document.getElementById("codeNum");
var areaName = document.getElementById("areaName");
var filler = document.getElementById("fillerFill");
var rightArrow = document.getElementById("rightArrow");
var upArrow = document.getElementById("upArrow");
var leftArrow = document.getElementById("leftArrow");
var downArrow = document.getElementById("downArrow");
var body = document.getElementsByName("body");


// vars
var mapx;
var mapy;
var map;
// map codes: 0 -> empty, 1 -> present, 2 -> unlocked, 3 -> visited
var infoArray;
var sx;
var sy;
var place;
var ma;
var colOptLst;
var tile;
var admin = false;


function reac(str) {
    let a = document.createElement("a");
    a.innerHTML = str;
    return a.firstElementChild;
}

//displays
//module codes: 1 -> text module, 2 -> input module, 3 -> image module
//modlette codes: text module: 1 -> title, 2 -> paragraph
//              : input module: 1 -> char input, 2 -> number choose, 3 -> colour button, 4 -> submit button, 5 -> word modulette
//completion codes: 1 -> unlock, 2 -> add module

//input "n" as {up:{lock:1, code:"CODE"}, down:{lock:1, code:"CODE"}} fr forreal
class DTile {
    constructor(n, code, title, modList) {
        this.code = code;
        this.title = title;
        this.modList = modList;

        this.neighbors = {
            ...{
                up: null,
                down: null,
                left: null,
                right: null
            },
            ...n
        };

    }

    updateDisplay() {
        let divider = reac(`
        <div class="dividerDiv">
            <img src="https://cdn.glitch.global/321b8c55-4809-4625-b3a3-f0b07719b7ad/divider.png?v=1662482099988" class="dividerImg">
            </img>
        </div>
        `)

        codeNum.innerHTML = this.code;
        areaName.innerHTML = this.title;
        filler.innerHTML = "";

        let first = true;
        for (let i = 0; i < this.modList.length; i++) {
            const modules = this.modList[i];
            if (!modules.locked) {
                if (!first) {
                    display.appendChild(divider.cloneNode(true));
                } else {
                    first = false;
                }
                display.appendChild(modules.create());
            }
        }
    }




}


//tiles
var tiles = [];
//to make tile making simpler:

async function loadStory(file) {
    const json = await fetch(file)
        .then(response => response.json())
    const areas = json.AREAS;
    let story = []
    Object.entries(json.content).forEach(([code, cont]) => {
        let mods = []

        for (let o = 0; o < cont.modules.length; o++) {
            let mod = cont.modules[o];
            let modlets = [];

            for (let i = 0; i < mod.modlets.length; i++) {
                let modlet = mod.modlets[i]
                let ml = eval(modlet[0] + "Modlet")
                modlets.push(new ml(modlet[0] + i, ...modlet[1]))
            }

            let m = eval(mod.name + "Mod")
            let state = mod["lock"] || false
            let extra = mod["extra"] || []

            mods.push(new m(state, mod.name + o, modlets, ...extra))
        }

        story.push(new DTile(cont.links, code, areas[cont.area - 1], mods));
    });
    return story;
}

// map codes: 0 -> empty, 1 -> present, 2 -> unlocked, 3 -> visited

const inputChange = `let x = document.getElementById(this.id).value.toUpperCase();
for (let i = 0; i < tile.modList.length; i++) {
    const element = tile.modList[i];
    if (element.name == 'input') {
        for (let j = 0; j < element.inputModlets.length; j++) {
            const modulette = element.inputModlets[j];
            if (modulette.id == this.id) {
                if (this.maxLength == 2) {
                    if (x.length > 1) {
                        x = x.substring(1)
                    }
                }
                modulette.val = x;
                document.getElementById(this.id).value = x;
                if (this.maxLength == 2) {
                    if (x.length > 0) {
                        changeFocus(this, true);
                    }
                }
            }
        }
    }
}`

const checkDelete = `
let x = document.getElementById(this.id).value.toUpperCase();
if (x.length < 1) {
    if (event.which == 8 || event.which == 48) {
        changeFocus(this, false)
    }
}
`

const colChange = `
for (let i = 0; i < tile.modList.length; i++) {
    const element = tile.modList[i];
    if (element.name == 'input') {
        for (let j = 0; j < element.inputModlets.length; j++) {
            const modulette = element.inputModlets[j];
            if (modulette.id == this.id) {
                modulette.val += 1;
                modulette.val = modulette.val % modulette.colLst.length;
                document.getElementById(modulette.id).style.backgroundColor = modulette.colLst[modulette.val];
            }
        }
    }
}
`

const submit = `
    let good = true;
    for (let i = 0; i < tile.modList.length; i++) {
        const element = tile.modList[i];
        if (element.name == 'input') {
            if (element.submitButton.id == this.id) {
                for (let j = 0; j < element.inputModlets.length; j++) {
                    const inputModulet = element.inputModlets[j];
                    console.log(inputModulet);
                    if (!inputModulet.check()) {
                        good = false;
                    }
                }
                if (good && !element.submitButton.complete) {
                    element.complete()
                } else {
                    element.fail()
                }
            }
        }
    }
`

function changeFocus(that, fwd) {
    let all = document.getElementsByClassName("charInp");
    for (let i = 0; i < all.length; i++) {
        const element = all[i];
        if (element == that) {
            if (fwd) {
                if (all[i + 1]) {
                    all[i + 1].focus()
                }
            }
            if (!fwd) {
                if (all[i - 1]) {
                    all[i - 1].focus()
                }
            }
        }
    }
}

//add modules or unlock tiles
function addNew(lst) {
    for (let i = 0; i < lst.length; i++) {
        const element = lst[i];
        switch (element[0]) {
            case 1:
                //unlock(element[1][0], element[1][1]);
                break;
            case 2:
                if (element[1] == 0) {
                    tile.modList[element[2]].locked = false;
                }
                else {
                    console.log(element[1][0], element[1][1], infoArray[element[1][0]][element[1][1]])
                    infoArray[element[1][0]][element[1][1]].modList[element[2]].locked = false;

                }
                break;
            default:
                break;
        }
    }
}



function clearModules() {
    for (let i = 0; i < tile.modList.length; i++) {
        const element = tile.modList[i];
        element.clear();
    }
    const x = document.getElementsByClassName("dividerDiv");
    const n = x.length
    for (let i = 0; i < n; i++) {
        const element = x[0];
        element.remove();
    }
}

//arrows
document.onkeydown = checkKey;

function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
        // up arrow
        if (!upArrow.classList.contains("disabled")) {
            clickArrow('up')
        }
    }
    else if (e.keyCode == '40') {
        // down arrow
        if (!downArrow.classList.contains("disabled")) {
            clickArrow('down')
        }
    }
    else if (e.keyCode == '37') {
        // left arrow
        if (!leftArrow.classList.contains("disabled")) {
            clickArrow('left')
        }
    }
    else if (e.keyCode == '39') {
        // right arrow
        if (!rightArrow.classList.contains("disabled")) {
            clickArrow('right')
        }
    }
    else if (e.keyCode == '13') {
        //enter
        for (let i = 0; i < tile.modList.length; i++) {
            const element = tile.modList[i];
            if (element.name == "input") {
                if (element.submitButton.complete == false) {
                    document.getElementById(element.submitButton.id).click();

                }
            }
        }

    }

}

function clickArrow(dir) {
    if (tile.neighbors[dir] != null && !tile.neighbors[dir].lock) {
        update(tiles.find(obj => obj.code == tile.neighbors[dir].code));
    }

}


function changeArrowState(value, htmlElem) {
    if (value) {
        htmlElem.classList.remove("disabled")
    } else {
        htmlElem.classList.add("disabled")
    }
}

function update(tar) {
    try {
        clearModules();
    } catch {
    }
    //console.log(tar)
    tile = tar
    tar.updateDisplay();

    //lock arrows
    let a = tile.neighbors
    changeArrowState(a.up != null && !a.up.lock, upArrow);
    changeArrowState(a.down != null && !a.down.lock, downArrow);
    changeArrowState(a.left != null && !a.left.lock, leftArrow);
    changeArrowState(a.right != null && !a.right.lock, rightArrow);

}


async function startStory(filePath) {
    display.innerHTML = "";
    tiles = await loadStory(filePath);
    console.log(tiles)
    update(tiles[0]);
}


async function readStoryRecord() {
    const storyRecord = await fetch('./story_record.json')
        .then(response => response.json())
    return storyRecord;
}


async function mainMenu() {
    let storyRecord = await readStoryRecord();


    areaName.innerHTML = "&#x1F30F; World of Escapades &#x1F30F;";
    codeNum.innerHTML = "&#x1F31F;";
    filler.innerHTML = "&#x1F31F;";

    let mainMenuDisplay = new TextMod(false, "1", [
        new TitleModlet("1", "Select the story you wish to play.")
    ])

    display.appendChild(mainMenuDisplay.create())

    Object.entries(storyRecord.stories).forEach(([title, filename]) => {
        display.innerHTML += `<div class="modulette">
        <div class="menuDiv flexItem">
            <button type="button" class="menuButton" onclick="startStory('./ModFolder/${filename}')">
            ${title}
            </button>
        </div>
    </div>`
    })
}



//initializes game
mainMenu()
