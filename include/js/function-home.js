
//define variables

let noAccount = true

const menu = document.getElementById("side-menu")
const content = document.getElementById("content")

const contentchange = content.clientWidth += menu.clientWidth;

var togglemenu = gsap.timeline({yoyo: true, defaults:{ease:'power1.out' }})
.to(menu, {width: 0}, 0)
.to(content, {width: contentchange, borderRadius: 0}, 0)
.reverse()


function movemenu() {

    if (togglemenu.reversed()) {
        togglemenu.play();
    } else {
        togglemenu.reverse();
    }

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

    var toggleModalcontent = gsap.timeline({yoyo: true, opacity: 1, visibility:"hidden", defaults:{ease: Power1.easeInOut }})
    .to(".modal-content", {width: '80%', borderRadius: '100px'})

    if (thisModal.style.display == "block"){

        toggleModalcontent.play().reverse;
        thisModal.style.display = "none";

    }else{

        toggleModalcontent.play()
        thisModal.style.display = "block";

    }
}

function switchmodalcontent(){

    const title = document.getElementById("modal-title")
    const form = document.getElementById("modal-form")
    const fullName = document.getElementById("fullname")
    const accountCheck = document.getElementById("account-check")
    const switchLogin = document.getElementById("switch-login")
    const submit = document.getElementById("modalformsubmit")

    if(noAccount){

        title.textContent = "Login";
        document.modalForm.action = "/login"
        fullName.style.display = "none";
        accountCheck.textContent = "dont have an account?"
        switchLogin.textContent = "Sign Up"
        submit.textContent = "Sign In"
        noAccount = false
        
    }else{

        title.textContent = "Register";
        document.modalForm.action = "/register"
        fullName.style.display = "inline";
        accountCheck.textContent = "already have an account?"
        switchLogin.textContent = "Sign In"
        submit.textContent = "Sign Up"
        noAccount = true

    }
}