
    

function renderChartInsideModal() {
    const canvas = document.getElementById('bitcoinPriceChart');
    const crypto = "bitcoin"

    fetch(`https://api.coincap.io/v2/assets/${crypto}/history?interval=h6`)
    .then(response => response.json())
    .then(data => {

        const slicedData = data.data.slice(0, 28);

        // Extract data from the JSON response
        const chartData = {
            labels: [], // Array for date labels
            priceData: [] // Array for price data
        };

        data.data.forEach(point => {
            // Convert the timestamp to a date string
            const date = new Date(point.time).toLocaleDateString();

            // Push date and price to the corresponding arrays
            chartData.labels.push(formatDate(point.time));
            chartData.priceData.push(point.priceUsd);
        });

        console.log(chartData);

        const ctx = canvas.getContext('2d');
        var chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: slicedData.map(point => new Date(point.time).toLocaleDateString()),
                datasets: [{
                    label: crypto,
                    data: slicedData.map(point => point.priceUsd),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            }
        });
    });
}



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

function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:00`;
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
        renderChartInsideModal();

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

//function for updating the chart
function updateChart(crypto) {
    const chart = Chart.getChart('bitcoinPriceChart');
    fetch(`/crypto-history?crypto=${crypto}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            chart.data.datasets[0].label = crypto;
            chart.data.labels = data.data.map(point => new Date(point.time).toLocaleDateString());
            chart.data.datasets[0].data = data.data.map(point => point.priceUsd);
            chart.update();
        });
}