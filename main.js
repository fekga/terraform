String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

function toFixed(value, precision) {
    var power = Math.pow(10, precision || 0);
    return String(Math.round(value * power) / power);
}

window.addEventListener('load', function() {

    var elements = {
        txtPower: document.querySelector("#res-power"),
        divUpgrades: document.querySelector("#upgrades"), 
        txtCompBase: document.querySelector("#comp-base"),
        btnCompBase: document.querySelector("#upgrade-comp-base"),
        txtCompPerc: document.querySelector("#comp-perc"),
        btnCompPerc: document.querySelector("#upgrade-comp-perc")
    };
    
    elements.divUpgrades.style.display = "none";
    
    
    function Resource(name,value){
        this.name = name;
        this.value = value;
    }
    
    function Power(value){
        Resource.call(this,"power",value);
    }
    
    var resPower = new Power(0);
    var compBaseUpgrade = new Power(10);
    var compPercUpgrade = new Power(200);
    
    var compUpgrades = {
        baseUpgrade: {
            count: 1,
            cost: compBaseUpgrade,
            value: 1,
        },
        percUpgrade: {
            count: 0,
            cost: compPercUpgrade,
            value: 5, // percent
        }
    }
    
    elements.btnCompBase.addEventListener('click', function(evt) {
        if (resPower.value < compUpgrades.baseUpgrade.cost.value) return;
        
        compUpgrades.baseUpgrade.count += 1;
        resPower.value -= compUpgrades.baseUpgrade.cost.value;
        compUpgrades.baseUpgrade.cost.value = Math.ceil(compUpgrades.baseUpgrade.cost.value * 1.25);
        updateCompBaseText();
        updatePowerText();
    });
    
    elements.btnCompPerc.addEventListener('click', function(evt) {
        if (resPower.value < compUpgrades.percUpgrade.cost.value) return;
        
        compUpgrades.percUpgrade.count += 1;
        resPower.value -= compUpgrades.percUpgrade.cost.value;
        compUpgrades.percUpgrade.cost.value = Math.ceil(compUpgrades.percUpgrade.cost.value * 2.5);
        updateCompPercText();
        updatePowerText();
    });
    
    function updateCompBaseText() {
        elements.txtCompBase.innerHTML = "{0} x {1}".format(compUpgrades.baseUpgrade.count,compUpgrades.baseUpgrade.value);
        elements.btnCompBase.innerHTML = "Upgrade (" + compUpgrades.baseUpgrade.cost.value + ")";
        elements.btnCompBase.disabled = Boolean(resPower.value < compUpgrades.baseUpgrade.cost.value);
        
        if (elements.divUpgrades.style.display === "none" && resPower.value >= compUpgrades.baseUpgrade.cost.value){
            elements.divUpgrades.style.display = "block";
        }
    }
    
    function updateCompPercText() {
        elements.txtCompPerc.innerHTML = "{0} x {1}%".format(compUpgrades.percUpgrade.count,compUpgrades.percUpgrade.value);
        elements.btnCompPerc.innerHTML = "Upgrade (" + compUpgrades.percUpgrade.cost.value + ")";
        elements.btnCompPerc.disabled = Boolean(resPower.value < compUpgrades.percUpgrade.cost.value);
    }
    
    function getPowerGain(){
        return {
        base: compUpgrades.baseUpgrade.count * compUpgrades.baseUpgrade.value, 
        perc: 100 + compUpgrades.percUpgrade.count * compUpgrades.percUpgrade.value
        };
    }
    
    function updatePowerText() {
        var gain = getPowerGain();
        var powerText = "{0} (+{1} x {2}%)".format(toFixed(resPower.value,2),gain.base,gain.perc);
        elements.txtPower.innerHTML = powerText;
        
        updateCompBaseText();
        updateCompPercText();
    }
    
    function updatePower() {
        var gain = getPowerGain();
        gain = gain.base * gain.perc/100.;
        console.log(gain);
        resPower.value += gain;
        updatePowerText();
    }
    
    function gameLoop() {
        updatePower();
        window.setTimeout(gameLoop, 1000);
    }
    
    updateCompBaseText();
    updateCompPercText();
    
    gameLoop();

});