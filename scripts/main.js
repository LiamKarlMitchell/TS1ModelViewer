// Configure Require.js
require.config( {
  // Default load path for js files
  shim: {
    // --- Use shim to mix together all THREE.js subcomponents
    'three': { exports: 'THREE' },
    'OrbitControls': ['three']
    // 'TrackballControls': { deps: ['threeCore'], exports: 'THREE' },
    // // --- end THREE sub-components
    // 'detector': { exports: 'Detector' },
    // 'stats': { exports: 'Stats' },
  }, 
  map: {
  	'OrbitControls': { 'THREE': 'three' }
  },
  // Third party code lives in js/lib
  paths: {
    // --- start THREE sub-components
    three: 'three',
    // threeCore: '../lib/three.min',
    // TrackballControls: '../lib/controls/TrackballControls',
    // // --- end THREE sub-components
    // detector: '../lib/Detector',
    // stats: '../lib/stats.min',
  },
} );



require(['Alt1Object','three','OrbitControls'], function(Alt1Object,THREE) {
	// var scene = new THREE.Scene();
	// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	// var renderer = new THREE.WebGLRenderer();
	// renderer.setSize( window.innerWidth, window.innerHeight );
	// document.body.appendChild( renderer.domElement );


	// function doneLoadingModel(filename, resource) {
	// 	console.log('Done loading '+filename);

	// 	var geometry = new THREE.CubeGeometry(1,1,1);
	// 	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	// 	var cube = new THREE.Mesh( geometry, material );
	// 	scene.add( cube );

	// 	camera.position.z = 5;

	// }

   //var test = new Alt1Object('assets/TS/G03_GDATA/D04_GSOBJECT/006/D006001001.SOBJECT');
///var test = new Alt1Object('assets/TS/G03_GDATA/D04_GSOBJECT/001/C004007037.SOBJECT');

   //var test = new Alt1Object('assets/TS2/G03_GDATA/D04_GSOBJECT/006/W005004017005.SOBJECT');
///   var test = new Alt1Object('assets/G03_GDATA/D04_GSOBJECT/001/C001001001.SOBJECT'); // Hair
//var test = new Alt1Object('assets/G03_GDATA/D02_GMOBJECT/001/C001238.MOBJECT');

var Files = [
// Basic Char
'D04_GSOBJECT/001/C001001001.SOBJECT',
];

// Files = Files.sort(function(a,b) {
// 	var nameA = a.substr(a.lastIndexOf('/')+1);
// 	var nameB = b.substr(b.lastIndexOf('/')+1);
// 	if(nameA < nameB) return -1;
//     if(nameA > nameB) return 1;
// 	return 0;
// });

/*var select = document.createElement('select');
for (var i=0;i<Files.length;i++) {
  var value = Files[i];
  var name = value.substr(value.lastIndexOf('/')+1);

  doRender = false;

  var option = document.createElement("option");
  option.setAttribute("value", value);
  option.innerHTML = name;
  select.appendChild(option);  
}*/

//var btnDownloadAn8 = document.createElement('button');
//btnDownloadAn8.innerHTML = 'Download an8';

//btnDownloadAn8.onclick = function(e) {
//	lastLink.click(e);
//}
//document.body.appendChild(btnDownloadAn8);

 var material_wireframe = new THREE.MeshBasicMaterial(  
{  
  color:0x00FF00,
  wireframe: true  
});

//var testTexture = new THREE.ImageUtils.loadTexture( 'images/test.png' );

function makeThreeJSModel() {
  //loadedResource
  var Content;
  window.myObjects = [];

  var mesh = new THREE.Mesh();
  for (var x=0;x<loadedResource.contents.length;x++) {
    Content = loadedResource.contents[x];
  
    var g = new THREE.Geometry();

    var data = Content.Mesh.content;
    for (var i=0;i<data.numVerts;i++) {
      var V = data.verts[i];
      g.vertices.push(new THREE.Vector3(V.X,V.Y,V.Z));
    }

    //debugger;
    for (var i = 0;i<data.numFaces;i++) {
     var f = data.faces[i];
     var face = new THREE.Face3(f.A,f.B,f.C);

     var A = data.verts[f.A];
     var B = data.verts[f.B];
     var C = data.verts[f.C];

     face.vertexNormals = [ new THREE.Vector3(A.NX,A.NY,A.NZ),
                            new THREE.Vector3(B.NX,B.NY,B.NZ), 
                            new THREE.Vector3(C.NX,C.NY,C.NZ)
                          ];

     g.faces.push(face);

     g.faceVertexUvs[ 0 ].push(
        [
            new THREE.Vector2( A.UV[0], 1+A.UV[1] ),
            new THREE.Vector2( B.UV[0], 1+B.UV[1] ),
            new THREE.Vector2( C.UV[0], 1+C.UV[1] ),
            
        ] );
    };

    for (var t=0;t<Content.TextureCount;t++) {
      var texture = THREE.ImageUtils.loadDDSTexture(Content.Textures[t].dds.content.buffer, true);
      texture.wrapS = THREE.RepeatWrapping;

      // Turn this off or N043001001 looks nightmare ish.
      //texture.repeat.x = - 1;


      var material = new THREE.MeshPhongMaterial({

        map:texture,
        //map: testTexture,
        //ambient: 0x222222, color: 0x19A8CB, specular: 0x49D8FB, shininess: 50, perPixel: false, overdraw: true
        
        specular: 0,
        //intermediate
        //color: 0xFFFFFF,
        //dark
        shininess: 0,
        //color:   new THREE.Color(Content.Mesh.content.color1.R, Content.Mesh.content.color1.G, Content.Mesh.content.color1.B),
        //ambient: new THREE.Color(Content.Mesh.content.color1.R, Content.Mesh.content.color1.G, Content.Mesh.content.color1.B),
        //ambient: 0xFFFFFF,
        //specular: new THREE.Color(Content.Mesh.content.color2.R, Content.Mesh.content.color2.G, Content.Mesh.content.color2.B),
		//wireframe:true
      });
      material.side = THREE.DoubleSide;
      break;
    }
	
  // var ballMaterial = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: true } );
  // ballSprite = new THREE.Sprite( ballMaterial );
  // ballSprite.scale.set( texture.image.width, texture.image.height, 1.0 );
  // ballSprite.position.set( 50, 50, 0 );
  // scene.add( ballSprite );

 //gobj = new THREE.SceneUtils.createMultiMaterialObject(g, [new THREE.MeshLambertMaterial({color: 0x7EC1EA, map:texture}), new THREE.MeshBasicMaterial({ color: 0x00FF00, wireframe: true, transparent: false, opacity: 0.2 } )] );
	

    var gobj = new THREE.Mesh(g, material); 
    gobj.position.y = -8;


// /* Compute normals */
// g.computeFaceNormals();
// g.computeVertexNormals();

// /* Next 3 lines seems not to be mandatory */
// gobj.geometry.dynamic = true
// gobj.geometry.__dirtyVertices = true;
// gobj.geometry.__dirtyNormals = true;

// gobj.flipSided = true;
// gobj.doubleSided = true;

// /* Flip normals*/               
// for(var i = 0; i<gobj.geometry.faces.length; i++) {
//     gobj.geometry.faces[i].normal.x = -1*gobj.geometry.faces[i].normal.x;
//     gobj.geometry.faces[i].normal.y = -1*gobj.geometry.faces[i].normal.y;
//     gobj.geometry.faces[i].normal.z = -1*gobj.geometry.faces[i].normal.z;
// }    



    //scene.add(gobj);
    mesh.add(gobj);
    console.log('Adding Mesh');
    window.myObjects.push(gobj);
  }
  
  scene.add(mesh);
  window.mesh = mesh;
  return mesh;
}

function getAnim8or(filename,data) {
    var edges = [];
    // for (var i = 0;i<data.numFaces;i++) {
    //  var f = data.faces[i];
    //  edges.push({A: f.A,B: f.B});
    //  edges.push({A: f.A,B: f.C});
    //  edges.push({A: f.B,B: f.C});
    // };

    // for (var i=0;i<data.numVerts-2;i++) {
    //   edges.push({A: i, B: i+1});
    //   edges.push({A: i, B: i+1});
    //   edges.push({A: i+1, B: i+2});
    //   edges.push({A: i+2, B: i});
    // }


    var output = 'object { "'+filename.substr(filename.lastIndexOf('/')+1)+'"\n';
    output+='  mesh {\n';
    output+='    name { "mesh01" }\n';
    output+='    material { " -- default --" }\n';
    output+='    smoothangle { 45 }\n';
    output+='    /* Filename: '+filename+' */\n'
    output+='    /* '+data.numVerts+' points, '+data.numFaces+' faces, '+edges.length+' edges*/\n'
    output+='    /* ? special edges */\n'
    output+='    materiallist {\n';
    output+='      materialname { " -- default --" }\n';

    // Output mesh materials here
    //Math.ceil(255 * color)
  // material { "material01"
  //   surface {
  //     /* RGB chunk no longer used */
  //     rgb { 255 255 255 }
  //     lockambiantdiffuse { }
  //     ambiant {
  //       rgb { 255 255 255 }
  //       factor { 0.30000 }
  //     }
  //     diffuse {
  //       rgb { 255 255 255 }
  //       factor { 0.70000 }
  //     }
  //     specular {
  //       rgb { 255 255 255 }
  //       factor { 0.20000 }
  //     }
  //     phongsize { 32 }
  //   }
  //   backsurface {
  //     /* RGB chunk no longer used */
  //     rgb { 0 0 0 }
  //     lockambiantdiffuse { }
  //     ambiant {
  //       rgb { 0 0 0 }
  //       factor { 0.30000 }
  //     }
  //     diffuse {
  //       rgb { 0 0 0 }
  //       factor { 0.70000 }
  //     }
  //     specular {
  //       rgb { 255 255 255 }
  //       factor { 0.20000 }
  //     }
  //     phongsize { 32 }
  //   }
  // }    


    output+='    }\n'
    output+='    points {';

    for (var i=0;i<data.numVerts;i++) {
      var V = data.verts[i];
      if (i % 3 == 0) output+='\n      ';
      output +='('+V.X+' '+V.Y+' '+(V.Z)+') ';
    }

    // Output points
    //(%f %f %f) 
    output+='\n    }\n';


// texcoords {
//         (-1.9578 16.517) (-1.8221 16.173) (-1.9944 16.492) (-1.8587 16.147) 
//         (-1.7986 16.25) (-1.8946 16.494) (-1.8483 16.834) (-1.8117 16.859) 
//         (-1.4839 16.026) (-1.5205 16.001) (-1.5595 16.146) (-1.5713 16.491) 
//         (-1.7912 16.735) (-1.5058 16.971) (-1.4692 16.997) (-1.1415 16.164) 
//         (-1.1781 16.139) (-1.3173 16.244) (-1.214 16.485) (-1.3099 16.729) 
//         (-1.5491 16.833) (-0.99530 16.505) (-1.0319 16.48) (-1.1311 16.85) 
//         (-1.1677 16.825)
//       }

    output+='    texcoords {';

    for (var i=0;i<data.numVerts;i++) {
      var UV = data.verts[i].UV;
      if (i % 4 == 0) output+='\n      ';
      output +='('+UV[0]+' '+UV[1]+') ';
    }

    // Output points
    //(%f %f %f) 
    output+='\n    }\n';


    // output+='    edges {';
    // // Output edges between two vertercies
    // //(%u %u)
    // for (var i=0;i<edges.length;i++) {
    //   var e = edges[i];
    //   if (i % 8 == 0) output+='\n      ';
    //   output +='('+e.A+' '+e.B+') '; 
    // }
    //output+='\n    }\n';


    output+='    faces {';
    // faces {
    //   4 4 0 -1 ( (0 0) (4 4) (6 6) (2 2) )
    //   4 4 0 -1 ( (1 1) (3 3) (7 7) (5 5) )
    //   4 4 0 -1 ( (0 0) (2 2) (3 3) (1 1) )
    //   4 4 0 -1 ( (4 4) (5 5) (7 7) (6 6) )
    //   4 4 0 -1 ( (2 2) (6 6) (7 7) (3 3) )
    //   4 4 0 -1 ( (0 0) (1 1) (5 5) (4 4) )
    // }

    // 3 1 0 -1 ( (2) (0) (1) )

    for (var i = 0;i<data.numFaces;i++) {
     var f = data.faces[i];
     output+='\n      3 0 0 -1 ( ('+f.A+') ('+f.B+') ('+f.C+') )';
    };    

    output+='\n    }\n';
    output+='  }\n';
    output+='}\n';
    return output;
    
// object { "object01"
//   mesh {
//     name { "mesh01" }
//     material { }
//     materiallist {
//       materialname { " -- default --" }
//     }
//     points {
//       (-16 -16 -16) (-16 -16 16) (-16 16 -16) (-16 16 16) (16 -16 -16) 
//       (16 -16 16) (16 16 -16) (16 16 16)
//     }
//     edges {
//       (0 4) (4 6) (2 6) (0 2) (1 3) (3 7) (5 7) (1 5) (2 3) (0 1) (4 5) (6 7)
//     }
//   }
// }
  }


var loadedResource = null;
var lastLink = null;
function loaded(filename, resource) {

	// Destroy all the objects in the scene
	var obj, i;
	for ( i = scene.children.length - 1; i >= 0 ; i -- ) {
		obj = scene.children[ i ];
		if ( obj !== camera) {
			scene.remove(obj);
		}
	}


      //add subtle ambient lighting
      //var ambientLight = new THREE.AmbientLight(0xFFFFFF);
      //scene.add(ambientLight);
      scene.add( light );

    // Create a light, set its position, and add it to the scene.

      
      // // directional lighting
      // var directionalLight = new THREE.DirectionalLight(0xffffff);
      // directionalLight.position.set(1, 1, 1).normalize();
      // scene.add(directionalLight); 

	if (resource == null) return;

	console.log('Loaded Data for '+filename);
	
	loadedResource = resource;	


  ///////////
  // FLOOR //
  ///////////
  
  // note: 4x4 checkboard pattern scaled so that each square is 25 by 25 pixels.
   //var floorTexture = new THREE.ImageUtils.loadTexture( 'images/test.jpg' );
   //floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
   //floorTexture.repeat.set( 10, 10 );
  // // DoubleSide: render texture on both sides of mesh
  // var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
   //var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
	/*var floor = new THREE.Mesh(
		new THREE.PlaneGeometry(40,40, 10,10),
		new THREE.MeshPhongMaterial({color:0x0f0f, wireframe:true}) 
	);
   floor.position.y = -8;
   floor.rotation.x = Math.PI / 2;
   floor.receiveShadow = true;
   scene.add(floor); */ 

  /////////
  // SKY //
  /////////
  
  // recommend either a skybox or fog effect (can't use both at the same time) 
  // without one of these, the scene's background color is determined by webpage background

  // make sure the camera's "far" value is large enough so that it will render the skyBox!
  // var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
  // // BackSide: render faces from inside of the cube, instead of from outside (default).
  // var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
  // var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
  // scene.add(skyBox);

  makeThreeJSModel();
  //output.innerHTML = 'Loaded: '+select.value;
}

/*select.onchange = function(event) {
	output.innerHTML = 'Please wait loading file: '+select.value;
	try {
		test = new Alt1Object(select.value, loaded);
	} catch(e) {
		console.log(e);
	}
}
document.body.appendChild(select);*/

// WEBGL Stuff
// set the scene size
var WIDTH = 1024,
    HEIGHT = 768;

// set some camera attributes
var VIEW_ANGLE = 45,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 0.01,
  FAR = 20000;

var scene = new THREE.Scene();
window.scene = scene;
var camera =
  new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR);


var light = new THREE.PointLight( 0xFFFFFF, 1, 1000 );
//  var light = new THREE.DirectionalLight( 0xffffff );
// light.position.set( 0, 1, 1 ).normalize();

var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize( 800, 600 );
renderer.setClearColor( 0xFFFFFF, 1) ;


// var composer, dpr, effectFXAA, renderScene;

// dpr = 1;
// if (window.devicePixelRatio !== undefined) {
//   dpr = window.devicePixelRatio;
// }

// renderScene = new THREE.RenderPass(scene, camera);
// effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
// effectFXAA.uniforms['resolution'].value.set(1 / (800 * dpr), 1 / (600 * dpr));
// effectFXAA.renderToScreen = true;

// composer = new THREE.EffectComposer(renderer);
// composer.setSize(800 * dpr, 600 * dpr);
// composer.addPass(renderScene);
// composer.addPass(effectFXAA);


//var geometry = new THREE.CubeGeometry(10,10,10);
// var material = new THREE.MeshPhongMaterial({
//         // light
//         specular: '#CCCCCC',
//         // intermediate
//         color: '#CCCCCC',
//         // dark
//         emissive: '#CCCCCC',
//         shininess: 50 
//       });
//  //var material = new THREE.MeshPhongMaterial( { ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30 } );
// //var material = new THREE.LineBasicMaterial( { color: 0x00FF00, opacity: 1, blending: THREE.AdditiveBlending, transparent: true } )

camera.position.y = 0;
camera.position.z = -40;
camera.position.x = 0;

//var theta = 0;

var controls = new THREE.OrbitControls(camera);
controls.autoRotate = true;
controls.autoRotateSpeed = 6;

function render() {
	requestAnimationFrame(render);

	//cube.rotation.x += 0.1;
	//cube.rotation.y += 0.1;

	// Rotate camera around object.

	// var x = camera.position.x;
	// var z = camera.position.z;

	// theta += 1;

	// camera.position.x = x * Math.cos(theta) + z * Math.sin(theta);
	// camera.position.z = z * Math.cos(theta) - x * Math.sin(theta);
	camera.lookAt(0, 0, 0);	 //camera.lookAt(cube.position); 
	controls.update();
	light.position = camera.position;  


	renderer.render(scene, camera);
}

// renderer.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
// renderer.domElement.addEventListener( 'mousedown', controls.onMouseDown, false );
renderer.domElement.addEventListener( 'mousewheel', controls.onMouseWheel, false );
// renderer.domElement.addEventListener( 'DOMMouseScroll', controls.onMouseWheel, false ); // firefox

document.body.appendChild( document.createElement('br') );
document.body.appendChild( renderer.domElement );

var output = document.createElement('div');
output.id = 'output';
document.body.appendChild(output);


//var test = new Alt1Object(select.value, loaded);
render();






/* Handle File Uploads
   These could be drag and dropped or uploaded via clicking button
*/
function loadFile() {
	var input, file;

	input = document.getElementById('fileinput');
	if (!input) {
	    alert("p", "Um, couldn't find the fileinput element.");
	}
	else if (!input.files) {
	    alert("This browser doesn't seem to support the `files` property of file inputs.");
	}
	else if (!input.files[0]) {
	    alert("Please select a file before clicking 'Load'");
	}
	else {
	  file = input.files[0];
		try {
			test = new Alt1Object({ file: file }, function(filename, resource) { loaded(file.name,resource); });
		} catch(e) {
			console.log(e);
		}
  }
}

if (typeof window.FileReader === 'function') {
document.ondrop = function(e) {
    e.preventDefault();

    var file = e.dataTransfer.files[0],
        fr = new FileReader();
	fr.onload = function() {
		try {
			test = new Alt1Object({ data: fr.result }, loaded);
		} catch(e) {
			console.log(e);
		}
	};
	fr.readAsBinaryString(file);
}
}

document.getElementById('fileinput').onchange = loadFile;
document.getElementById('btnLoad').onclick = loadFile;

});