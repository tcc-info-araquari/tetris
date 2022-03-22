import "./fullgame.js"
import { colors } from "./fullgame.js"

// Find and locate the state of the button of devMode
function verifyDevMode() {
    let devBtn = document.getElementById("DevMode")
    devBtn.checked ? dev() : turnOff()
}

function dev() {
    console.log("DevMode is ON")
    showMenu()
}

function turnOff() {
    console.log("DevMode is OFF")
    menu.classList.toggle("hidden")
}

const devButton = document.getElementById("DevMode").addEventListener("click", verifyDevMode)
const menu = document.getElementById("menu")

function showMenu(){
    menu.classList.toggle("hidden")
}