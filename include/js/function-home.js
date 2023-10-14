
//define variables

const menu = document.getElementById("side-menu")
const content = document.getElementById("content")

const contentchange = content.clientWidth += menu.clientWidth;

var togglemenu = gsap.timeline({yoyo: true, defaults:{ease:'power1.out' }})
.to(menu, {width: 0}, 0)
.to(content, {width: contentchange, borderRadius: 0}, 0)
.reverse()


function movemenu() {

    // .to('.one .block', {scaleX:0, transformOrigin:'left center'},0)
    // .to('.two .block', {scaleX:0, transformOrigin:'right center'},0)
    if (togglemenu.reversed()) {
        togglemenu.play();
    } else {
        togglemenu.reverse();
    }



    // gsap.to(menu, {
    //     x: -menu.clientWidth
    // })
    // gsap.to(content, {
    //     x: -menu.clientWidth,
    //     width: contentchange
    // })
}

function animateCircles(){

    gsap.to(".circle", {
        x: window.innerWidth,
        duration: 4
    })

    gsap.set(".circle", {
        x: 0
    })

    console.log(window.innerWidth);
}

function togglemodal(modal){

    const thisModal = document.getElementById(modal)

    var toggleModalcontent = gsap.timeline({yoyo: true, defaults:{ease:'power1.out' }})
    .to(".modal-content", {width: '80%', borderRadius: '100px'})

    if (thisModal.style.display = "none"){
        thisModal.style.display = "block";
        toggleModalcontent.play();
    }else{
        thisModal.style.display = "none";
        toggleModalcontent.play().reverse
    }
}