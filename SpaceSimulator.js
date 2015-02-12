function SpaceSimulator()
{
	this.audio = new Audio('Lee_Rosevere_-_04_-_Chapter_Seven_-_Re-entry.mp3');
	this.audio.play();
	this.audio.addEventListener('ended', this.replay.bind(this), false);
	
	this.textures = new Array();
	this.lensFlare = null;
	
	this.sprites = new Array();
	
	this.ship = null;
	
	this.renderer = null;
	this.scene = null;
	this.camera = null;
	
	this.skybox = null;
	
	this.stats = null;
	
	this.init();
	
	setInterval(this.mainLoop.bind(this), 1000/60);
	window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
}

SpaceSimulator.prototype.replay = function()
{
	this.audio.currentTime = 0;
	this.audio.play();
}

SpaceSimulator.prototype.onWindowResize = function()
{
	this.camera.aspect = window.innerWidth / window.innerHeight;
	this.camera.updateProjectionMatrix();

	this.renderer.setSize( window.innerWidth, window.innerHeight );
}

SpaceSimulator.prototype.setupCollada = function(collada)
{
	this.ship = collada.scene;
	var skin = collada.skins[0];
	
	this.ship.scale.x = this.ship.scale.y = this.ship.scale.z = 0.05;
	this.ship.position.set(0, 0, 0);
	this.ship.updateMatrix();
	this.scene.add(this.ship);
	
	this.controller = new Controller(this.camera, this.ship, this.line);
}

SpaceSimulator.prototype.init = function()
{
	this.scene = new THREE.Scene();
	
	// Ship
	var loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis = true;
	loader.load('models/ship.dae', this.setupCollada.bind(this));
	
	var ambient = new THREE.AmbientLight( 0xC41D60 );
	this.scene.add( ambient );
	
	var textureFlare0 = THREE.ImageUtils.loadTexture( "textures/lensflare0.png" );
	var textureFlare2 = THREE.ImageUtils.loadTexture( "textures/lensflare2.png" );
	var textureFlare3 = THREE.ImageUtils.loadTexture( "textures/lensflare3.png" );
	
	this.textures.push(textureFlare0);
	this.textures.push(textureFlare2);
	this.textures.push(textureFlare3);
	
	var materialA = new THREE.SpriteMaterial({map:textureFlare0, color:0xffffff, fog:false, transparent:true, blending:THREE.AdditiveBlending, vertexColors:true});
	var material;
	
	for(var i = 0; i < 300; i++)
	{
		material = materialA.clone();
		material.color.setHSL(0.5 * Math.random(), 0.5, 0.75);
		
		var sprite = new THREE.Sprite(material);
		this.initParticle(sprite);
		this.scene.add(sprite);
		this.sprites.push(sprite);
	}
	
	var url = [
		'./textures/nebula_medium_right1.jpg',
		'./textures/nebula_medium_left2.jpg',
		'./textures/nebula_medium_top3.jpg',
		'./textures/nebula_medium_bottom4.jpg',
		'./textures/nebula_medium_front5.jpg',
		'./textures/nebula_medium_back6.jpg'
	];
	
	var cubemap = THREE.ImageUtils.loadTextureCube(url);
	cubemap.format = THREE.RGBFormat;
	
	var shader = THREE.ShaderLib['cube'];
	shader.uniforms['tCube'].value = cubemap;
	
	var skyBoxMaterial = new THREE.ShaderMaterial({
		fragmentShader:shader.fragmentShader,
		vertexShader:shader.vertexShader,
		uniforms:shader.uniforms,
		depthWrite:false,
		side:THREE.BackSide
	});
	
	this.skybox = new THREE.Mesh(new THREE.CubeGeometry(600000, 600000, 600000), skyBoxMaterial);
	this.skybox.position.set(0, 0, 0);
	this.scene.add(this.skybox);
	
	this.renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, precision:"highp"});
	this.renderer.setSize(window.innerWidth -40, window.innerHeight-40);
	this.renderer.setClearColor(0x000000, 1.0);
	
	container.appendChild(this.renderer.domElement);
	
	var light = new THREE.DirectionalLight(0x7AB3C4, 2);
	light.position.set(2, 4, 3);
	this.scene.add(light);
	
	var light = new THREE.DirectionalLight(0xD95555, 1);
	light.position.set(3, -4, 0);
	this.scene.add(light);
	
	this.camera = new THREE.PerspectiveCamera(45,(window.innerWidth-40)/(window.innerHeight-40), 4, 600000);
	this.camera.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,100));
	//this.camera.position.set(0,0,3);
	this.scene.add(this.camera);
	
	this.stats = new Stats();
	this.stats.domElement.style.position = 'absolute';
	this.stats.domElement.style.top = '8px';
	this.stats.domElement.style.zIndex = 100;
	container.appendChild( this.stats.domElement );
}

SpaceSimulator.prototype.render = function()
{
	this.renderer.render(this.scene, this.camera);
}

SpaceSimulator.prototype.update = function()
{
	var date = new Date().getTime();
	for(var i=0; i<this.sprites.length; i++)
	{
		this.sprites[i].material.opacity = Math.sin(date * 0.05) * 0.05 + 1;
		this.sprites[i].material.rotation = Math.sin(date * 0.001) * 0.1;
	}
	
	this.controller.update();
	this.stats.update();
}

SpaceSimulator.prototype.mainLoop = function()
{
	this.update();
	this.render();
}

SpaceSimulator.prototype.initParticle = function(particle)
{
	var particle = this instanceof THREE.Sprite ? this : particle;
	var x = Math.random() * 100000;
	x *= Math.random() < 0.5 ? -1 : 1;
	var y = Math.random() * 100000;
	y *= Math.random() < 0.5 ? -1 : 1;
	var z = Math.random() * 100000;
	z *= Math.random() < 0.5 ? -1 : 1;
	
	particle.position.set(x, y, z);
	
	particle.scale.x = particle.scale.y = Math.random() * 2000 + 600;
	particle.color
}

