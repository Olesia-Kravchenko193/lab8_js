const $btn = document.querySelector('.add-btn');
const $area = document.querySelector('.area');

const areaWidth = $area.offsetWidth;
const areaHeight = $area.offsetHeight;

const boxWidth = 200;
const boxHeight = 200;

let boxes = [];
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

if (localStorage.getItem('coords')) {
    boxes = JSON.parse(localStorage.getItem('coords'));
    boxGenerator(boxes);
}


function boxGenerator() {
    let template = '';
    for (let i = 0; i < boxes.length; i++) {
        template += '<div class="box" data-index="' + i + '" style="transform: translate(' + boxes[i].x + 'px, ' + 
        boxes[i].y + 'px)"><textarea rows="12" cols="22" data-index="' + i + '"> ' + boxes[i].text + '</textarea></div>';
    }
    console.log(template);
    $area.innerHTML = template;
}

function boxController(coords) {
    $selectedBox.style.cssText = 'transform: translate(' + coords.x + 'px, ' + coords.y + 'px)';
}

$area.addEventListener('mousedown', function (e) {
    if (!!e.target.classList.contains('box')) {
        action = true;
        $selectedBox = e.target;
        selectedBoxIndex = parseFloat($selectedBox.getAttribute('data-index'));

        startCoords.x = e.clientX;
        startCoords.y = e.clientY;
    }
    
});

$area.addEventListener('input', function(e) {
    $selectedBox = e.target;
    let sBoxIndex = parseFloat($selectedBox.getAttribute('data-index'));
    boxes[sBoxIndex] = {
        x: boxes[sBoxIndex].x,
        y: boxes[sBoxIndex].y,
        text: e.target.value
    };
});

$area.addEventListener('mouseup', function (e) {
    if (!e.target.classList.contains('add-btn')) {
        action = false;
        boxes[selectedBoxIndex].x = distance.x;
        boxes[selectedBoxIndex].y = distance.y;
        localStorage.setItem('coords', JSON.stringify(boxes));
    }

});

$area.addEventListener('mousemove', function (e) {
    if (action) {
        currentCoords.x = e.clientX;
        currentCoords.y = e.clientY;

        distance.x = boxes[selectedBoxIndex].x + (currentCoords.x - startCoords.x);
        distance.y = boxes[selectedBoxIndex].y + (currentCoords.y - startCoords.y);

        if (distance.x >= (areaWidth - boxWidth)) distance.x = areaWidth - boxWidth;
        if (distance.x <= 0) distance.x = 0;

        if (distance.y >= (areaHeight - boxHeight)) distance.y = areaHeight - boxHeight;
        if (distance.y <= 0) distance.y = 0;

        boxController(distance);
    }
});

$btn.addEventListener('click', function () {
    boxes.push({
        x: 0,
        y: 0,
        text: "Text№" + (boxes.length + 1)
    });
    boxGenerator(boxes);
});