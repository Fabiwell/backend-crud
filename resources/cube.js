const COLOR_TRIANGLE = "black";
const COLOR_BG = "gray";
const COLOR_CUBE = "black";
const SPEED_X = 0.05;
const SPEED_Y = 0.05;
const SPEED_Z = 0.05;
const POINT3D = function(x, y, z){this.x = x, this.y = y, this.z = z};
const object = function(x, y, w, h, radius){this.x = x, this.y = y, this.w = w, this.h = h, this.r = radius};
var menu = false;
var hoverstart = false;
var hovergithub = false;
var shadows = true;
var clickable = false;

var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
var ctx = canvas.getContext('2d');

var h = document.documentElement.clientHeight;
var w = document.documentElement.clientWidth;

canvas.height = h;
canvas.width = w;

ctx.fillStyle = COLOR_BG;
ctx.strokeStyle = COLOR_CUBE;
ctx.shadowColor = COLOR_CUBE;
ctx.lineWidth = w/1000;
ctx.lineCap = "round";
ctx.font = "20px Arial";

var cx = w / 2;
var cy = h / 2;
var cz = 0;
var size = h/4;
var vertices = [
    new POINT3D(cx - size, cy - size, cz - size),
    new POINT3D(cx + size, cy - size, cz - size),
    new POINT3D(cx + size, cy + size, cz - size),
    new POINT3D(cx - size, cy + size, cz - size),
    new POINT3D(cx - size, cy - size, cz + size),
    new POINT3D(cx + size, cy - size, cz + size),
    new POINT3D(cx + size, cy + size, cz + size),
    new POINT3D(cx - size, cy + size, cz + size)
];

var shadowswitch = new object(10, 10, 40, 20, 15);
var menu1 = new object(w/3, h/100, w/3, h/2 * 1.95, 15);
// var edges = [
//     [0, 1], [1, 2], [2, 3], [3, 0], 
//     [4, 5], [5, 6], [6, 7], [7, 4], 
//     [0, 4], [1, 5], [2, 6], [3, 7]
// ];

var timeDelta, timeLast = 0;
requestAnimationFrame(loop);

function loop(timeNow){
    timeDelta = timeNow - timeLast;
    timeLast = timeNow;

    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "darkgray";
    ctx.beginPath();
    ctx.arc(w/2, h/2, w/4, 0, Math.PI * 2, true); // Outer circle
    ctx.fill();

    angle = timeDelta * 0.001 * SPEED_Z * Math.PI * 2;
    for (let v of vertices) {
        let dx = v.x -cx;
        let dy = v.y -cy;
        let x = dx * Math.cos(angle) - dy * Math.sin(angle);
        let y = dx * Math.sin(angle) + dy * Math.cos(angle);
        v.x = x + cx;
        v.y = y + cy;
    }

    angle = timeDelta * 0.001 * SPEED_X * Math.PI * 2;
    for (let v of vertices) {
        let dy = v.y - cy;
        let dz = v.z - cz;
        let y = dy * Math.cos(angle) - dz * Math.sin(angle);
        let z = dy * Math.sin(angle) + dz * Math.cos(angle);
        v.y = y + cy;
        v.z = z + cz;
    }

    angle = timeDelta * 0.001 * SPEED_Y * Math.PI * 2;
    for (let v of vertices) {
        let dx = v.x - cx;
        let dz = v.z - cz;
        let x = dz * Math.sin(angle) + dx * Math.cos(angle);
        let z = dz * Math.cos(angle) - dx * Math.sin(angle);
        v.x = x + cx;
        v.z = z + cz;
    }

    // for (let edge of edges) {
    //     ctx.beginPath();
    //     ctx.moveTo(vertices[edge[0]].x, vertices[edge[0]].y);
    //     ctx.lineTo(vertices[edge[1]].x, vertices[edge[1]].y);
    //     ctx.stroke();
    // }
    for (let ver of vertices) {
        for (let verticy of vertices) {
            // console.log(edge);
            ctx.beginPath();
            ctx.moveTo(verticy.x, verticy.y);
            ctx.lineTo(ver.x, ver.y);
            ctx.stroke();
    }}

    //shadows
    ctx.fillStyle = "darkgray";
    roundedRect(ctx, 10, 10, 40, 10 * 1.95, 10);
    ctx.fillStyle = "lightgray";
    if(shadows){
        roundedRect(ctx, 30, 10, 20, 10 * 1.95, 10);
        ctx.shadowBlur = 12;
    }else{
        roundedRect(ctx, 10, 10, 20, 10 * 1.95, 10);
        ctx.shadowBlur = 0;
    }

    ctx.fillStyle = "darkgray";
    if(menu == false){
        ctx.fillStyle = COLOR_CUBE;
        ctx.fillRect(w/2 - 50, h/2 - 20, 100, 40);
        if(hoverstart == true){
            ctx.fillStyle = "darkgray";
        }else{
            ctx.fillStyle = "white";
        }
        ctx.fillRect(w/2 - 49, h/2 - 19, 98, 38);
        ctx.fillStyle = COLOR_CUBE;
        ctx.fillText("Start", w/2 - 25, h/2 + 5);
    }else{
        // ctx.fillStyle = "green";
        roundedRect(ctx, w/3, h/100, w/3, h/2 * 1.95, 15);
        ctx.fillStyle = COLOR_CUBE;
        roundedRect(ctx, w/3, h/100, w/3, h/2 * 1.95, 15, fill=false);

        var img1 = document.getElementById("github");
        ctx.drawImage(img1, w/3 + 10, h/100 + 10, 50, 50);
        var img2 = document.getElementById("linkedin");
        ctx.drawImage(img2, w/3 + 70, h/100 + 10, 50, 50);

        ctx.fillText("Profile", w/3 + 10, h/100 + 80)
        ctx.font = "15px Arial";
        ctx.fillText("Sample Text Sample Text Sample Text Sample Text Sample Text Sample Text Sample Text", w/3 + 10, h/100 + 95, maxwidth = w/3 - 20)
        ctx.fillText("Sample Text Sample Text Sample Text Sample Text Sample Text Sample Text Sample Text", w/3 + 10, h/100 + 110, maxwidth = w/3 - 20)
        ctx.fillText("Sample Text Sample Text Sample Text Sample Text Sample Text Sample Text Sample Text", w/3 + 10, h/100 + 125, maxwidth = w/3 - 20)
        ctx.fillText("Sample Text Sample Text Sample Text Sample Text Sample Text Sample Text Sample Text", w/3 + 10, h/100 + 140, maxwidth = w/3 - 20)
        ctx.fillText("Sample Text Sample Text Sample Text Sample Text Sample Text Sample Text Sample Text", w/3 + 10, h/100 + 155, maxwidth = w/3 - 20)
        ctx.fillText("Sample Text Sample Text Sample Text Sample Text Sample Text Sample Text Sample Text", w/3 + 10, h/100 + 170, maxwidth = w/3 - 20)
        ctx.fillText("Sample Text Sample Text Sample Text Sample Text Sample Text Sample Text Sample Text", w/3 + 10, h/100 + 185, maxwidth = w/3 - 20)
        ctx.fillText("Sample Text Sample Text Sample Text Sample Text Sample Text Sample Text Sample Text", w/3 + 10, h/100 + 200, maxwidth = w/3 - 20)
        ctx.font = "20px Arial";

    }
    ctx.fillStyle = COLOR_BG;

    if(clickable){
        canvas.style.cursor = "pointer";
    }else{
        canvas.style.cursor = "auto";
    }

    requestAnimationFrame(loop);
}



// canvas.addEventListener('click', function handleClick() {
// console.log('element clicked');
// console.log(canvas.client.x);
// console.log(canvas.client.y);
// });
function display(event) {
    if (isinside(event.x, event.y, w/2 - 50, h/2 - 20, w/2 + 50, h/2 + 20)){
        menu = true;
        // console.log(menu);
    }
    if (isinside(event.x, event.y, 10, 10, 50, 30)){
        if(shadows){
            shadows = false;
        }else{
            shadows = true;
        }
    }
    if(menu == false){
        if(isinside(event.x, event.y, 10, 10, 50, 30)){
        }else{
            vertices.push(new POINT3D(event.x, event.y, 0));
        }
    }
    else{
        if (isInCircle(w/3 + 35, h/100 + 10, 40, event.x, event.y) && menu == true){
            window.location.replace("https://github.com/Fabiwell/");
        }
        if (isinside(event.x, event.y, w/3 + 70, h/100 + 10, w/3 + 130, h/100 + 60)){
            window.location.replace("https://www.linkedin.com/in/fabian-van-well-1b236921b")
        }
    }
}

function isinside(pointx, pointy, x, y, x2, y2) {
    if(pointx >= x && pointy >= y && pointx <= x2 && pointy <= y2){
        return true;
    }
    else{
        return false;
    }
}

function isInCircle(circle_x, circle_y, rad, x, y){
    if ((x - circle_x) * (x - circle_x) + (y - circle_y) * (y - circle_y) <= rad * rad){
        return true;
    }
    else{
        return false;
    }
}
function onmovemouse(event){
    //shadows
    if (isinside(event.x, event.y, w/2 - 50, h/2 - 20, w/2 + 50, h/2 + 20) && menu == false || isinside(event.x, event.y, 10, 10, 50, 30) || isinside(event.x, event.y, w/3 + 70, h/100 + 10, w/3 + 130, h/100 + 60) && menu == true || isInCircle(w/3 + 35, h/100 + 10, 40, event.x, event.y) && menu == true){
        clickable = true;
        console.log('E')
    }
    else{
        clickable = false;
    }
}

function roundedRect(ctx, x, y, width, height, radius, fill = true) {
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.arcTo(x, y + height, x + radius, y + height, radius);
    ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    ctx.arcTo(x + width, y, x + width - radius, y, radius);
    ctx.arcTo(x, y, x, y + radius, radius);
    if(fill == true){
        ctx.fill();
    }else{
        ctx.stroke();
    }
}

// function newimage(name){
//     const ctx = document.getElementById("canvas").getContext("2d");
//     const img = new Image();
//     img.onload = () => {
//         ctx.drawImage(img, 0, 0);
//         // ctx.beginPath();
//         // ctx.moveTo(30, 96);
//         // ctx.lineTo(70, 66);
//         // ctx.lineTo(103, 76);
//         // ctx.lineTo(170, 15);
//         // ctx.stroke();
//     };
//     img.src = name;
// }