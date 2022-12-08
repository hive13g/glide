var scene = new THREE.Scene();
scene.background = new THREE.Color(0x303030);
var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0,5,10);
// camera.lookAt( 0, 0, 0 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

/* RESIZING */

window.addEventListener('resize',function(){
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width,height);
    camera.aspect=width/height;
    camera.updateProjectionMatrix;
})

/* ORBIT CONTROLS */

var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.maxPolarAngle = (Math.PI/2)-0.1; 
controls.update();

/* PLANE GEOMETRY */

var geometry = new THREE.PlaneBufferGeometry(10,10);
geometry.rotateX(-1.6);

/* COORDINATES (PORTA NIGRA)*/
var zoom = document.getElementById("mzoom").value;
var lon = 6.643997;
var lat = 49.759671;

const selectElement = document.querySelector("input");

selectElement.addEventListener('change', (event) => {
    location.reload();
});


/* MAP TILE TRANSFORMATION */
function lo2t(lon,zoom){
    return (lon+180)/360*Math.pow(2,zoom);
}
function la2t(lat,zoom){
    return (1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom);
}
function long2tile(lon,zoom) {return Math.floor(lo2t(lon,zoom)); }
function lat2tile(lat,zoom)  {return Math.floor(la2t(lat,zoom)); }

var x = long2tile(lon,zoom);
var y = lat2tile(lat,zoom);

/* EXAMPLE LINE */

var lon1 = 6.642393;
var lon2 = 6.643459;
var lon3 = 6.644689;
var lon4 = 6.645483;
var lon5 = 6.645663;
var lon6 = 6.644801;
var lon7 = 6.644283;
var lon8 = 6.643935;

var lat1 = 49.760551;
var lat2 = 49.760315;
var lat3 = 49.759979;
var lat4 = 49.759415;
var lat5 = 49.758467;
var lat6 = 49.757739;
var lat7 = 49.757170;
var lat8 = 49.756712;

var line_material = new THREE.LineBasicMaterial( { color: 0x0000ff, linewidth: 10} );

var points = [];
points.push( new THREE.Vector3( (long2tfac(lon1,zoom)*-10)-5, 0, (lat2tfac(lat1,zoom)*-10)-5 ));
points.push( new THREE.Vector3( (long2tfac(lon2,zoom)*-10)-5, 0.1, (lat2tfac(lat2,zoom)*-10)-5 ));
points.push( new THREE.Vector3( (long2tfac(lon3,zoom)*-10)-5, 0.15, (lat2tfac(lat3,zoom)*-10)-5 ));
points.push( new THREE.Vector3( (long2tfac(lon4,zoom)*-10)-5, 0.2, (lat2tfac(lat4,zoom)*-10)-5 ));
points.push( new THREE.Vector3( (long2tfac(lon5,zoom)*-10)-5, 0.21, (lat2tfac(lat5,zoom)*-10)-5 ));
points.push( new THREE.Vector3( (long2tfac(lon6,zoom)*-10)-5, 0.17, (lat2tfac(lat6,zoom)*-10)-5 ));
points.push( new THREE.Vector3( (long2tfac(lon7,zoom)*-10)-5, 0.1, (lat2tfac(lat7,zoom)*-10)-5 ));
points.push( new THREE.Vector3( (long2tfac(lon8,zoom)*-10)-5, 0, (lat2tfac(lat8,zoom)*-10)-5 ));

// points.push( new THREE.Vector3( -4.7, 0, -5 ));
// points.push( new THREE.Vector3( -4.5, 1.2, -4 ));
// points.push( new THREE.Vector3( -4.1, 1.5, -3 ));
// points.push( new THREE.Vector3( -3.7, 1.7, -2 ));
// points.push( new THREE.Vector3( -3.5, 1.6, -2.1 ));
// points.push( new THREE.Vector3( -3.6, 1.4, -1.6 ));
// points.push( new THREE.Vector3( -3.2, 1.1, -0.9 ));
// points.push( new THREE.Vector3( -3, 0, 1.1 ));

const line_geo = new THREE.BufferGeometry().setFromPoints( points );
const line = new THREE.Line( line_geo, line_material );

/* DOT POSITION TRANSFORMATION */
    function long2tfac(lon,zoom) {
        return long2tile(lon,zoom)-lo2t(lon,zoom);
    }
    function lat2tfac(lat,zoom) {
        return lat2tile(lat,zoom)-la2t(lat,zoom);
    }

    var dotx = (long2tfac(lon,zoom)*-10)-5;
    var doty = (lat2tfac(lat,zoom)*-10)-5;

/* DOT */
const dotGeometry = new THREE.BufferGeometry();
dotGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([dotx,0.1,doty]), 3));
const dotMaterial = new THREE.PointsMaterial({ size: 0.1, color: 0xff0000 });
const dot = new THREE.Points(dotGeometry, dotMaterial);

/* LOAD TILE FROM X Y: https://[a,b,c].tile.openstreetmap.org/zoom/x/y.png  */

var texture = new THREE.TextureLoader().load("https://a.tile.openstreetmap.org/"+zoom+"/"+x+"/"+y+".png");

var material = new THREE.MeshBasicMaterial( { map: texture, flatShading:true } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube, line, dot );

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
    controls.update();
}
animate();
