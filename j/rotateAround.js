var rotAxisIndex = 0;

function deg2rad(d){
    return d*Math.PI/180;
}

AFRAME.registerComponent('rotate-around', {
    schema:{
        speed: {type:'number', default:0.04},
        distance: {type:'number', default:10},
        currentAngle: {type:'number', default:0},
        autorotate:{type:'boolean', default:true},
        selfrotate:{type:'boolean', default:false},
        rotatedirection:{type:'boolean', default:true},
        limitposy:{type:'number', default:6},
        limitnegy:{type:'number', default:-6},
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
                if(py <= 3)
                    py += 3;
                break;
            case 'd':
                if(py >= -3)
                    py -= 3;
                break;
        }
        var px = data.distance*Math.cos(data.currentAngle%360);
        var pz = data.distance*Math.sin(data.currentAngle%360);
        this.el.setAttribute('position', px + ' ' + py + ' ' + pz);
        // ent.body.position.x = px;
        // ent.body.position.y = py;
        // ent.body.position.z = pz;
    },
    tick: function(){
        if(this.data.autorotate){
            var data = this.data;
            var ent = this.el;
            (data.rotatedirection)?data.currentAngle -= data.speed:data.currentAngle += data.speed;
            var px = data.distance*Math.cos(data.currentAngle%360);
            var py = ent.components.position.data.y;
            var pz = data.distance*Math.sin(data.currentAngle%360);
            //this.el.setAttribute('position', px + ' ' + py + ' ' + pz);
            if(ent.body != null){
                ent.body.position.x = px;
                ent.body.position.y = py;
                ent.body.position.z = pz;
                if(data.selfrotate){
                    //this.el.setAttribute('rotation', 0 + ' ' + rotAxisIndex + ' ' + 0); // method to use if no cannon physics is applied
                    ent.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), rotAxisIndex*Math.PI/180); 
                    rotAxisIndex=(rotAxisIndex+1)%360;
                }
            }
        }
    }
});