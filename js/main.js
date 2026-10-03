"use strict";
/*
 * Laboration 5 - Studentkortsgenerator
 * Namn: Linus Falk
 */

// Hämta element från DOM
const form = document.querySelector("#studentform");
const clearButton = document.querySelector("#clear");

const fullnameInput = document.querySelector("#fullname");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const fontSelect = document.querySelector("#font");

const previewFullname = document.querySelector("#previewfullname");
const previewEmail = document.querySelector("#previewemail");
const previewPhone = document.querySelector("#previewphone");
const previewCard = document.querySelector("#preview .card");

const errorList = document.querySelector("#errorlist");
const historySection = document.querySelector("#history");
const deleteHistoryButton = document.querySelector("#delete");


// Array som används för felmeddelanden
let errors = [];

// Array som innehåller sparade studentkort
let history = [];

/**
 * Validerar formulärets inmatning.
 * @returns {boolean}
 */
function validateForm() {

    // Kontrollera formulärets obligatoriska fält

    errors = []; // tömmer arrayen på tidigare fel

    // Checkar ifall rätt data har matats in
    if (fullnameInput.value.trim() === "") {
        errors.push("Ange ditt fullständiga namn.");
    } if (emailInput.value.trim() === "") {
        errors.push("Ange en korrekt email adress.");
    } if (phoneInput.value.trim() === "") {
        errors.push("Ange ett telefonnummer.");
    }

    // Visa eventuella felmeddelanden
    displayErrors();

    // Returnera resultatet (true eller false) av valideringen
        if (errors.length === 0) {
        return true;
    } else {
        return false;
    }

}

/**
 * Visar felmeddelanden på sidan.
 */
function displayErrors() {

    // Rensa tidigare felmeddelanden
    errorList.textContent = ""; // Rensar errorlist sektionen

    // Skriv ut aktuella felmeddelanden till DOM
    for ( let i = 0; i < errors.length; i++) {
        const listEl = document.createElement("li");
        listEl.textContent = errors[i];

        errorList.appendChild(listEl); // Lägger till nya listelementet i errorlist
    }
}


/**
 * Skapar ett studentkort och visar det på sidan.
 */
function createStudentCard() {

    // Hämta information från formuläret
    const fullname = fullnameInput.value;
    const email = emailInput.value;
    const phone = phoneInput.value;
    const font = fontSelect.value;

    // Uppdatera studentkortet
    previewFullname.textContent = fullname;
    previewEmail.textContent = email;
    previewPhone.textContent = phone;
    previewCard.style.fontFamily = font;

    // Lägg till studentkortet i historiken
    const student = {
        name: fullname,
        email: email,
        phone: phone,
        font: font
    };
    history.unshift(student); // Lägger till studenten först i historik arrayen

    // Spara och uppdatera historiken
    saveHistory();
    renderHistory();
}


/**
 * Sparar historiken i localStorage.
 */
function saveHistory() {
    // Spara history i localStorage
    localStorage.setItem("history", JSON.stringify(history));

}


/**
 * Läser in tidigare historik från localStorage.
 */
function loadHistory() {
    // Hämta eventuell sparad historik
    const savedHistory = localStorage.getItem("history");
    
    // Uppdatera history
    if (savedHistory !== null) { // Om det finns sparad historik. Valde denna if istället för (if (savedHistory)) för att vara extra tydlig för min skull.
        history = JSON.parse(savedHistory);
    }
}


/**
 * Visar historiken på sidan.
 */
function renderHistory() {

    // Rensa tidigare visad historik
    historySection.textContent = ""; // Rensar historik sektionen

    // Skriv ut innehållet i history till DOM
    for ( let i = 0; i < history.length; i++) { // loopar igenom historik arrayen och skapar nya listelement för varje student
        const student = history[i];
        const studentListEl = document.createElement("li");
        studentListEl.textContent = student.name + " - " + student.email + " - " + student.phone;
        historySection.appendChild(studentListEl); // Lägger till alla nya listelement i historik sektionene
    }
    console.log(historySection); // Kollar att historiken renderas rätt (tillfällig)
}


/**
 * Rensar formulär, aktuellt studentkort och felmeddelanden.
 */
function clearForm() {

    // Återställ formulär och studentkort
    form.reset(); // Återställer formuläret
    previewFullname.textContent = "Namn"; // Rensar och återställer studentkortet till namn
    previewEmail.textContent = "E-post"; // Rensar och återställer studentkortet till email
    previewPhone.textContent = "Telefon"; // Rensar och återställer studentkortet till telefonnummer
    previewCard.style.fontFamily = ""; // Återställer fonten på studentkortet till standardvärdet


    // Rensa eventuella felmeddelanden
    errors = []; // Tömmer errors arrayen på felmeddelanden
    errorList.textContent = ""; // Rensar errorList sektionen
}


/**
 * Raderar hela historiken.
 */
function deleteHistory() {

    // Radera sparad historik
    localStorage.removeItem("history"); // Tar bort historiken från localStorage
    history = []; // Tömmer historik arrayen
    renderHistory(); // Anropar den då den rensar tidigare historik och den skippar for loopen eftersom historik arrayen är tom från raden innan
    //historySection.textContent = ""; // Rensar historik sektionenen


    // Uppdatera history och visningen på sidan
}


// Eventlyssnare

form.addEventListener("submit", function(event) {
    
    event.preventDefault(); // Förhindrar att formuläret laddar om sidan vid submit

    // - validera inmatningen
    if (validateForm() === true) {
        createStudentCard(); // - skapa studentkort om valideringen lyckas
    }
});
// När formuläret skickas:



// När användaren klickar på "Rensa"
clearButton.addEventListener("click", clearForm); // Anropar clearForm när användaren klickar på knappen "Rensa"


// När användaren klickar på "Radera historik"
deleteHistoryButton.addEventListener("click", deleteHistory); // Anropar deleteHistory när användaren klickar på knappen "Radera historik"


// När sidan laddas:
loadHistory(); 
renderHistory();

// - läs in och visa eventuell tidigare historik