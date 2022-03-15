// Find and locate the state of the button of devMode
function verifyDevMode(){
    dev = document.getElementById("DevMode")
    dev.checked ? console.log("DevMode is ON") && dev() : console.log("DevMode is OFF")


}

dev = document.getElementById("DevMode").addEventListener("click", verifyDevMode)
