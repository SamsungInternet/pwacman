var _gamepads = null;
var _pwac = null;
var _lives = 3;
var _score = 0;
var _prevTimeStamp = 0;
var _curTimeStamp = 0;
var _crumbNum = 0;

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
    sortGamepadConn();
    //configures keys and gamepad
    configureInput();
    //get a global ref to pwacman
    _pwac = document.getElementById('pwacman');
    //collisions with pwacman / testing purposes
    _pwac.addEventListener('collide', function(e){
        //records timestamps to ensure no duplicate collisions are activated
        if(_curTimeStamp == 0)
            _curTimeStamp = e.timeStamp;
        else{
            _prevTimeStamp = _curTimeStamp;
            _curTimeStamp = e.timeStamp;
        }
        if(isCollisionValid(_prevTimeStamp, _curTimeStamp, 1000)){
            //checks for type of collision: crumb or ghost
            switch(e.detail.body.el.nodeName){
                case 'A-OBJ-MODEL':
                    hitByGhost();
                    break;
                case 'A-SPHERE':
                    hitByCrumb(e.detail.body.el);
                    break;
            }
        }
    });
}

//Handles gamepad connections and disconnections
function sortGamepadConn(){
    //gamepad is connected
    window.addEventListener('gamepadconnected', function(e) {
        _gamepads = navigator.getGamepads();
        console.log("connected: " + e.gamepad.id);
    });
    //gamepad is disconnected
    window.addEventListener("gamepaddisconnected", function(e) {
        console.log("disconnected: " + e.gamepad.id);
    });
}

//when you eat a crumb you score 10 points!
function hitByCrumb(domCrumb){
    _score += 10;
    document.getElementsByTagName('a-scene')[0].removeChild(domCrumb);
}

//When collides with ghost you loose a turn!
function hitByGhost(){
    _pwac.setAttribute('position', '0 0 0');
    if(_lives >= 1){
        _lives--;
        document.querySelector('#lives').setAttribute('src', '#l'+_lives);
        document.querySelector('#lostLife').emit('lostlifeMax');
        document.querySelector('#lostLife').emit('lostlifeMin');
        console.log('lives: ' + _lives);
    }else{
        document.querySelector('#gameOver').emit('enterGo');
        console.log('Game Over');
    }
}

//checks if collision is valid with timestamps to avoid triggering multiple times the same collision
function isCollisionValid(prevTimeStamp, curTimeStamp, threshold){
    return (curTimeStamp-prevTimeStamp) > threshold;
}

//creates and positions the crumbs in the level
function createCrumbs(numberAppIcons, radius, looseAxisPos){
    for(i = -1; i < numberAppIcons; i++){
        var c = document.createElement('a-sphere');
        c.setAttribute('color', 'silver');
        c.setAttribute('radius', 0.1);
        c.setAttribute('id', 'c'+_crumbNum);
        c.setAttribute('dynamic-body', 'shape:sphere;linearDamping:1');
        _crumbNum++;
        var cpx = radius * Math.cos((360 / numberAppIcons)*i);
        var cpy = looseAxisPos;
        var cpz = radius * Math.sin((360 / numberAppIcons)*i);
        c.setAttribute('position', cpx + ' ' + cpy + ' ' +cpz );
        document.getElementsByTagName('a-scene')[0].appendChild(c);
    }
}
    
function configureInput(){
    //adds support for arrow keys 
    window.addEventListener('keydown', function(e){
        switch (e.keyCode) {
            case 46: //left
                _pwac.components['rotate-around'].move('l');
                break;
            case 36: //up
                _pwac.components['rotate-around'].move('u');
                break;
            case 34: //right
                _pwac.components['rotate-around'].move('r');
                break;
            case 35: //down
                _pwac.components['rotate-around'].move('d');
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
    //creates crumbs
    for (j = -6; j < 10; j = j+3){
        createCrumbs(10,10,j);
    }
    //positions pwacman to startGame
    for(k = 0; k < 5; k++){
        _pwac.components['rotate-around'].move('l');
    }
    //triggers event to 
    document.querySelector('#splashScreen').emit('goAway');
}