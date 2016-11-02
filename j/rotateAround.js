var rotAxisIndex = 0;

AFRAME.registerComponent('rotate-around', {
    schema:{
        speed: {type:'number', default:0.1},
        distance: {type:'number', default:10},
        currentAngle: {type:'number', default:0},
        autorotate:{type:'boolean', default:true},
        selfrotate:{type:'boolean', default:false}
    },
    init: function(){
        //this.el.setAttribute('position', 0 + ' ' + 0 + ' ' + this.data.distance);
    },
    move: function(dir){ 
        var data = this.data;
        var ent = this.el;
        var py = ent.components.position.data.y;
        switch (dir) {
            case 'l':
                data.currentAngle -= data.speed;
                break;
            case 'r':
                data.currentAngle += data.speed;
                break;
            case 'u':
                py += 1;
                break;
            case 'd':
                py -= 1;
                break;
        }
        var px = data.distance*Math.cos(data.currentAngle%360);
        var pz = data.distance*Math.sin(data.currentAngle%360);
        this.el.setAttribute('position', px + ' ' + py + ' ' + pz);
    },
    tick: function(dir){
        if(this.data.autorotate){
            var data = this.data;
            var ent = this.el;
            (dir)?data.currentAngle -= data.speed:data.currentAngle += data.speed;
            var px = data.distance*Math.cos(data.currentAngle%360);
            var py = ent.components.position.data.y;
            var pz = data.distance*Math.sin(data.currentAngle%360);
            this.el.setAttribute('position', px + ' ' + py + ' ' + pz);
            if(data.selfrotate){
                this.el.setAttribute('rotation', 0 + ' ' + rotAxisIndex + ' ' + 0);
                rotAxisIndex=(rotAxisIndex+1)%360;
            }
        }
    }
});