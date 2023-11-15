// Declare a variable for the chart
let chart;

// Function to render the chart inside a modal
function renderChartInsideModal(crypto) {

    // Convert crypto to lowercase for consistency
    crypto = crypto.toLowerCase();

    // Get the canvas element by its ID
    const canvas = document.getElementById('bitcoinPriceChart');

    // Check if there is an existing chart, and if yes, destroy it
    let existingChart = Chart.getChart(canvas);
    if (existingChart) {
        existingChart.destroy();
    }

    // Fetch historical data for the specified cryptocurrency
    fetch(`https://api.coincap.io/v2/assets/${crypto}/history?interval=h6`)
    .then(response => response.json())
    .then(data => {

        // Slice the data to include only the first 28 points
        const slicedData = data.data.slice(0, 28);
        
        // Extract data from the JSON response
        const chartData = {
            labels: [], // Array for date labels
            priceData: [] // Array for price data
        };

        // Iterate through data points and format the data for the chart
        data.data.forEach(point => {
            const date = new Date(point.time).toLocaleDateString();
            chartData.labels.push(formatDate(point.time));
            chartData.priceData.push(point.priceUsd);
        });

        // Get the canvas context and create a new line chart
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

// Define variables

// Flag to track if the user has an account
let noAccount = true;

// Get menu and content elements by ID
const menu = document.getElementById("side-menu");
const content = document.getElementById("content");

// Calculate the width change when toggling the menu
const contentchange = content.clientWidth += menu.clientWidth;

// Create a timeline for menu animation
var togglemenu = gsap.timeline({yoyo: true, defaults:{ease:'power1.out' }})
.to(menu, {width: 0}, 0)
.to(content, {width: contentchange, borderRadius: 0}, 0)
.reverse();

// Function to toggle the menu animation
function movemenu() {
    if (togglemenu.reversed()) {
        togglemenu.play();
    } else {
        togglemenu.reverse();
    }
}

// Function to set wallet value through a fetch request
function setWalletValue() {
    fetch(`/wallet?user=${user}&userId=${userId}&coin=${priceUsd}&priceUsd=${priceUsd}&priceEuro=${priceEuro}&amount=${amount}&icon=${icon}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });
}

// Function to format a timestamp into a date string
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:00`;
}

// Function to toggle a modal with optional cryptocurrency information
function togglemodal(modal, crypto = "bitcoin", price = "0", volume = "0", supply = "0"){

    const thisModal = document.getElementById(modal);

    // Create a timeline for modal content animation
    var toggleModalcontent = gsap.timeline({yoyo: true, opacity: 1, visibility: "hidden", defaults:{ease: Power1.easeInOut }})
    .to(".modal-content", {width: '80%', borderRadius: '100px'});

    if (thisModal.style.display == "block"){

        toggleModalcontent.play().reverse();
        thisModal.style.display = "none";

    } else {

        toggleModalcontent.play();
        thisModal.style.display = "block";

        // Get modal elements and populate them with data
        const modalTitle = document.getElementById('bitcoin-modal-title');
        const modalPrice = document.getElementById('bitcoin-modal-price');
        const modalVolume = document.getElementById('bitcoin-modal-volume');
        const modalSupply = document.getElementById('bitcoin-modal-supply');

        modalTitle.innerHTML = crypto;
        modalPrice.innerHTML = "Price Usd: " + price;
        modalVolume.innerHTML = "Volume: " + volume;
        modalSupply.innerHTML = "Supply: " + supply;

        // Render the chart inside the modal
        renderChartInsideModal(crypto);
    }
}

// Function to switch modal content between login and register
function switchmodalcontent(){

    const title = document.getElementById("modal-title");
    const form = document.getElementById("modal-form");
    const fullName = document.getElementById("fullname");
    const accountCheck = document.getElementById("account-check");
    const switchLogin = document.getElementById("switch-login");
    const submit = document.getElementById("modalformsubmit");

    if(noAccount){

        title.textContent = "Login";
        document.modalForm.action = "/login";
        fullName.style.display = "none";
        accountCheck.textContent = "dont have an account?";
        switchLogin.textContent = "Sign Up";
        submit.textContent = "Sign In";
        noAccount = false;
        
    } else {

        title.textContent = "Register";
        document.modalForm.action = "/register";
        fullName.style.display = "inline";
        accountCheck.textContent = "already have an account?";
        switchLogin.textContent = "Sign In";
        submit.textContent = "Sign Up";
        noAccount = true;
    }
}