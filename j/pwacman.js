var _pwacman = null;
var _gamepads = null;
var _pwac = null;

function gamepadaction(){
    if(_gamepads != null){
        var gp = _gamepads[0];
        if(gp.axes[0] < -0.7){
            _pwac.components['rotate-around'].move('l');
        }
        if(gp.axes[0] > 0.7){
            _pwac.components['rotate-around'].move('r');
        }
        if(gp.axes[1] < -0.7){
            _pwac.components['rotate-around'].move('u');
        }
        if(gp.axes[1] > 0.7){
            _pwac.components['rotate-around'].move('d');
        }
    }
    window.requestAnimationFrame(gamepadaction);
}


function init(){
    //gamepad is connected
    window.addEventListener('gamepadconnected', function(e) {
        _gamepads = navigator.getGamepads();
        console.log("connected: " + e.gamepad.id);
    });
    //gamepad is disconnected
    window.addEventListener("gamepaddisconnected", function(e) {
        console.log("disconnected: " + e.gamepad.id);
    });
    //configures keys and gamepad
    configureInput();
    //get a global ref to pwacman
    _pwac = document.getElementById('pwacman');
    //collisions with pwacman / testing purposes
    _pwac.addEventListener('collide', function(e){
        console.log('Collision detected ' + e.detail.body.el);
    });
}

function createCrumbs(numberAppIcons, radius, looseAxisPos){
    for(i = -1; i < numberAppIcons; i++){
        var c = document.createElement('a-sphere');
        c.setAttribute('color', 'silver');
        c.setAttribute('radius', 0.1);
        var cpx = radius * Math.cos((360 / numberAppIcons)*i);
        var cpy = looseAxisPos;
        var cpz = radius * Math.sin((360 / numberAppIcons)*i);
        c.setAttribute('position', cpx + ' ' + cpy + ' ' +cpz );
        document.getElementsByTagName('a-scene')[0].appendChild(c);
    }
}
    
function configureInput(){
    var pac = document.getElementById('pwacman');
    //adds support for arrow keys 
    window.addEventListener('keydown', function(e){
        switch (e.keyCode) {
            case 37: //left
                pac.components['rotate-around'].move('l');
                break;
            case 38: //up
                pac.components['rotate-around'].move('u');
                break;
            case 39: //rightytyu
                pac.components['rotate-around'].move('r');
                break;
            case 40: //down
                    pac.components['rotate-around'].move('d');
                break;
        }
    });
    //configures gamepad
    gamepadaction();
}

function startPwacman(){
    init();
}

function startGame(){
    for (i = -5; i > 8; i=i+3){
        createCrumbs(10,10,i);
    }
}