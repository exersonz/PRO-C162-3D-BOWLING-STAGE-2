AFRAME.registerComponent("bowling-balls", {
    init: function(){
        this.throwBall();
    },
    throwBall: function(){
        window.addEventListener("keydown", (e) => {
            if(e.key === "z"){
                var ball = document.createElement("a-entity");

                ball.setAttribute("geometry", {
                    primitive: "sphere",
                    radius: 0.1
                });

                ball.setAttribute("material", "color", "black");

                var cam = document.querySelector("#camera");
                
                pos = cam.getAttribute("position");

                ball.setAttribute("position", {
                    x: pos.x,
                    y: pos.y,
                    z: pos.z
                });

                //fetching the camera element as an object of Three.js
                var camera = document.querySelector("#camera").object3D;

                //getting the camera direction as Three.js vector
                var direction = new THREE.Vector3();
                camera.getWorldDirection(direction);

                //setting the velocity and it's direction
                ball.setAttribute("velocity", direction.multiplyScalar(-2.5));

                var scene = document.querySelector("#scene");

                //setting the ball as a dynamic body
                ball.setAttribute("dynamic-body", {
                    shape: "sphere",
                    mass: "0"
                });

                //adding the collide event listener to the ball
                ball.addEventListener("collide", this.removeBall);

                scene.appendChild(ball);
            }
        });
    },
    removeBall: function(e){
        //original entity (ball)
        console.log(e.detail.target.el);

        //other entity (the one the ball collides with - pin
        console.log(e.detail.body.el);

        //ball element
        var elment = e.detail.target.el;

        //element which is hit (bowling pin)
        var elementHit = e.detail.body.el;

        //condition to remove the event listener and then remove the bullet as the child entity from the scene when it collides with the pins
        if(elementHit.includes("bowling-pin")){
            //setting the material attribute
            elementHit.setAttribute("material", {
                opacity: 1,
                transparent: true
            });

            //impulse and point vector
            var impulse = new CANNON.Vec3(-2, 2, 1); //Cannon.js object
            var worldPoint = new CANNON.Vec3().copy(elementHit.getAttribute("position")) //copying the position of the hit element (pin)

            elementHit.body.applyImpulse(impulse, worldPoint); //parameters are impulse (amount of impulse exerted on the body) and worldPoint (the point at which the force is applied)

            //removing the bowling balls from the scene to prevent memory leak
            var scene = document.querySelector("#scene");
            scene.removeChild(elment);
        }
    }
});