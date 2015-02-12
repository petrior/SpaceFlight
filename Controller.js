function Controller(camera, target)
{
	this.velocity = 10;
	this.camera = camera;
	
	this.target = target;
	this.target.rotationAutoUpdate = true;
	
	this.position = new THREE.Vector3(0, 0, 0);
	this.lastPosition = new THREE.Vector3(0, 0, 0);
	
	this.normalVector = new THREE.Vector3(0, 0, -1);
	this.upVector = new THREE.Vector3(0, -1, 0);
	this.sideVector = new THREE.Vector3(-1, 0, 0);

	this.projector = new THREE.Projector();
	
	this.translateVector = new THREE.Vector3();
	this.rotateVector = new THREE.Vector3();
	
	this.mPosition = new THREE.Vector2();
	this.lPosition = new THREE.Vector2();
	
	this.offset = new THREE.Vector3();
	this.thetaDelta = 0;
	this.phiDelta = 0;
	
	this.input = new Input();
	container.ondblclick = this.getDirection.bind(this);
}

Controller.prototype.update = function()
{
	this.input.update();

	var vector = new THREE.Vector3();
	
	if(this.input.isKeyDown(this.input.keyEnum.ArrowRight) || this.input.isKeyDown(this.input.keyEnum.ArrowLeft))
	{
		if(this.input.isKeyDown(this.input.keyEnum.ArrowRight))
			angle = Math.PI / 180;
		else angle = -Math.PI / 180;
		
		this.target.rotateOnAxis(this.normalVector, angle);
	}
	
	if(this.input.isKeyDown(this.input.keyEnum.ArrowUp) || this.input.isKeyDown(this.input.keyEnum.ArrowDown))
	{
		if(this.input.isKeyDown(this.input.keyEnum.ArrowUp))
			angle = -Math.PI / 180;
		else angle = Math.PI / 180;
		
		this.target.rotateOnAxis(this.sideVector, angle);
	}
	
	
	this.lastPosition.copy(this.position);
	this.target.translateZ(-this.velocity);
	this.position.copy(this.target.position);
	
	var vektori = new THREE.Vector3().subVectors(this.position, this.lastPosition);
	this.camera.position.x += vektori.x;
	this.camera.position.y += vektori.y;
	this.camera.position.z += vektori.z;

	
	if(this.input.isMouseDown())
	{
		this.mPosition.copy(this.input.getMousePosition());
		this.lPosition.copy(this.input.getLastMousePosition());
	}
	else
	{
		this.mPosition.x = this.mPosition.y = 0;
		this.lPosition.x = this.lPosition.y = 0;
	}
	
	this.updateCamera();
}

Controller.prototype.updateCamera = function()
{
	var rotateDelta = new THREE.Vector2().subVectors(this.mPosition, this.lPosition);
	//left
	this.thetaDelta -= 2 * Math.PI * rotateDelta.x / container.clientWidth * 1;
	//up
	this.phiDelta -= 2 * Math.PI * rotateDelta.y / container.clientHeight * 1;
	
	var position = this.camera.position.add(this.translateVector);
	
	this.offset.copy(position).sub(this.target.position);
	
	var theta = Math.atan2( this.offset.x, this.offset.z );
	var phi = Math.atan2( Math.sqrt( this.offset.x * this.offset.x + this.offset.z * this.offset.z ), this.offset.y );
	
	theta += this.thetaDelta;
	phi += this.phiDelta;
	
	// restrict phi to be between desired limits
	phi = Math.max( 0, Math.min( Math.PI, phi ) );

	// restrict phi to be betwee EPS and PI-EPS
	phi = Math.max( 0.000001, Math.min( Math.PI - 0.000001, phi ) );
	
	var scale = 1;
	var radius = this.offset.length() * scale;
	
	// restrict radius to be between desired limits
	var minDistance = 1;
	var maxDistance = 10;
	radius = Math.max( minDistance, Math.min( maxDistance, radius ) );
	
	this.offset.x = radius * Math.sin( phi ) * Math.sin( theta );
	this.offset.y = radius * Math.cos( phi );
	this.offset.z = radius * Math.sin( phi ) * Math.cos( theta );
	
	position.copy( this.target.position ).add( this.offset );
	
	this.camera.lookAt( this.target.position );
	
	this.thetaDelta = 0;
	this.phiDelta = 0;
}

Controller.prototype.getDirection = function(event)
{
	/*
	var x = event.clientX;
	var y = event.clientY;
	
	var vector = new THREE.Vector3(
		(x / window.innerWidth) * 2 - 1,
		-(y / window.innerHeight) * 2 + 1,
		0.5
	);
	
	this.projector.unprojectVector(vector, this.camera);
	var direction = vector.sub(this.camera.position).normalize();
	var pointDirection = new THREE.Vector3().copy(direction);
	
	var distance = - this.camera.position.z / pointDirection.z;
	var pos = this.camera.position.clone().add( pointDirection.multiplyScalar( distance ) );
	
	direction.normalize();
	var rotationAxis = new THREE.Vector3();
	rotationAxis.crossVectors(this.normalVector, direction);
	rotationAxis.normalize();
	
	var pistetulo = this.normalVector.dot(direction);
	var theta = Math.acos(pistetulo);
	
	this.target.rotateOnAxis(rotationAxis, theta);
	this.line.rotateOnAxis(rotationAxis, theta);
	this.line.updateMatrixWorld();
	
	this.normalVector.copy(direction);
	this.normalVector.normalize();
	
	this.translateVector.copy(direction);
	this.translateVector.multiplyScalar(5);
	*/
}