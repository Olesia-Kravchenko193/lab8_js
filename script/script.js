const $btn = document.querySelector('.add-btn');
const $area = document.querySelector('.area');

const areaWidth = $area.offsetWidth;
const areaHeight = $area.offsetHeight;

const boxWidth = 200;
const boxHeight = 200;

let boxes = [];
let boxesTextBox = [];
let action = false;
let $selectedBox = null;
let selectedBoxIndex = null;

let startCoords = {
    x: 0,
    y: 0
}
let currentCoords = {
    x: 0,
    y: 0
}
let distance = {
    x: 0,
    y: 0
}

if (!!localStorage.getItem('coords')) {
    boxes = JSON.parse(localStorage.getItem('coords'));
    boxesTextBox = JSON.parse(localStorage.getItem('textBox'));
    boxGenerator(boxes, boxesTextBox);
}


function boxGenerator(boxesList, boxesTextList) {
    let template = '';
    for (let i = 0; i < boxesList.length; i++) {
        template += '<div class="box" id="' + String(i) + "box" + '" style="transform: translate(' + boxesList[i].x + 'px, ' + boxesList[i].y + 'px)">';
        template += '<textarea class="textArea" placeholder="Введите данные" rows="12" cols="22" id="' + String(i) + "textarea" + '"> ' + boxesTextList[i] + '</textarea></div>';
    }
    $area.innerHTML = template;
    console.log($area);
}

function boxController(coords) {
    $selectedBox.style.cssText = 'transform: translate(' + coords.x + 'px, ' + coords.y + 'px)';
}

$area.addEventListener('click', function(e) {
    if(!!e.target.classList.contains('textArea')){
        e.target.addEventListener('input', function (e) {
            boxesTextBox[e.target.id.slice(0, 1)] = document.getElementById(`${String(e.target.id.slice(0, 1)) + "textarea"}`).value;
            localStorage.setItem('textBox', JSON.stringify(boxesTextBox));
        })
    }
});

$area.addEventListener('mousedown', function (e) {
    if (!!e.target.classList.contains('box')) {
        action = true;
        $selectedBox = e.target;
        selectedBoxIndex = e.target.id;
        startCoords.x = e.clientX;
        startCoords.y = e.clientY;
    }
    
});

$area.addEventListener('mouseup', function (e) {
    if (!!e.target.classList.contains('box')) {
        action = false;
        boxes[selectedBoxIndex.slice(0, 1)].x = distance.x;
        boxes[selectedBoxIndex.slice(0, 1)].y = distance.y;
        localStorage.setItem('coords', JSON.stringify(boxes));
    }

});

$area.addEventListener('mousemove', function (e) {
    if (action) {
        currentCoords.x = e.clientX;
        currentCoords.y = e.clientY;

        distance.x = boxes[selectedBoxIndex.slice(0, 1)].x + (currentCoords.x - startCoords.x);
        distance.y = boxes[selectedBoxIndex.slice(0, 1)].y + (currentCoords.y - startCoords.y);

        if (distance.x >= (areaWidth - boxWidth)) distance.x = areaWidth - boxWidth;
        if (distance.x <= 0) distance.x = 0;

        if (distance.y >= (areaHeight - boxHeight)) distance.y = areaHeight - boxHeight;
        if (distance.y <= 0) distance.y = 0;

        boxController(distance);
    }
});

$btn.addEventListener('click', function () {
    if (!!boxes.length) {
        boxes.push({
            x: 0,
            y: 0
         })
        boxesTextBox.push("");
    } else {
        boxes = [{
            x: 0,
            y: 0
        }];
        boxesTextBox = [""];
    }
    boxGenerator(boxes, boxesTextBox);

    localStorage.setItem('coords', JSON.stringify(boxes));
    localStorage.setItem('textBox', JSON.stringify(boxesTextBox));
});