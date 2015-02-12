function Input()
{
	this.currentMouseCoords = new THREE.Vector2();
	
	this.mPosition = new THREE.Vector2(0, 0);
	this.lPosition = new THREE.Vector2(0, 0);
	
	this.mouseState = false;
	
	this.keyEnum = { ArrowUp:0, ArrowDown:1, ArrowRight:2, ArrowLeft:3 };
	this.keyArray = new Array(4);
	
	// Mouse inputs.
	container.onmousemove = this.saveMousePosition.bind(this);
	container.onmouseup = this.mouseUp.bind(this);
	container.onmousedown = this.mouseDown.bind(this);
	container.onmouseout = this.mouseOut.bind(this);
	
	// Keyboard inputs.
	document.onkeydown = this.keyDown.bind(this);
	document.onkeyup = this.keyUp.bind(this);
}

Input.prototype.update = function()
{
	this.lPosition.copy(this.mPosition);
	this.mPosition.copy(this.currentMouseCoords);
}

Input.prototype.saveMousePosition = function(event)
{
	this.currentMouseCoords.x = event.clientX;
	this.currentMouseCoords.y = event.clientY;
}

Input.prototype.mouseUp = function()
{
	this.mouseState = false;
}

Input.prototype.mouseDown = function(event)
{
	event.preventDefault();
	this.mouseState = true;
}

Input.prototype.mouseOut = function(event)
{
	event.preventDefault();
	this.mouseState = false;
}

Input.prototype.isMouseUp = function()
{
	if(this.mouseState == false)
		return true;
	else return false;
}

Input.prototype.isMouseDown = function()
{
	if(this.mouseState == true)
		return true;
	else return false;
}

Input.prototype.getMousePosition = function()
{
	return this.mPosition;
}

Input.prototype.getLastMousePosition = function()
{
	return this.lPosition;
}

Input.prototype.keyDown = function(event)
{
	//event.preventDefault();
	switch(event.keyCode)
	{
		case 38: // Up arrow.
			this.keyArray[this.keyEnum.ArrowUp] = true;
			break;
		case 40: // Down arrow.
			this.keyArray[this.keyEnum.ArrowDown] = true;
			break;
		case 39: // Right arrow.
			this.keyArray[this.keyEnum.ArrowRight] = true;
			break;
		case 37: // Left arrow.
			this.keyArray[this.keyEnum.ArrowLeft] = true;
			break;
		default:
			break;
	}
}

Input.prototype.keyUp = function(event)
{
	//event.preventDefault();
	switch(event.keyCode)
	{
		case 38: // Up arrow.
			this.keyArray[this.keyEnum.ArrowUp] = false;
			break;
		case 40: // Down arrow.
			this.keyArray[this.keyEnum.ArrowDown] = false;
			break;
		case 39: // Right arrow.
			this.keyArray[this.keyEnum.ArrowRight] = false;
			break;
		case 37: // Left arrow.
			this.keyArray[this.keyEnum.ArrowLeft] = false;
			break;
		default:
			break;
	}
}

Input.prototype.isKeyDown = function(kCode)
{
	return this.keyArray[kCode];
}

