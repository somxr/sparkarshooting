// Load in the required modules
const Scene = require('Scene');
const Materials = require('Materials');
const TouchGestures = require('TouchGestures');
const Reactive = require('Reactive');
const Diagnostics = require('Diagnostics');
const Time = require('Time');
const Animation = require('Animation');

// Enables async/await in JS [part 1]
(async function() {
	// Locate the focal distance object in the Scene panel and the material in the Materials panel
	const [ focalDistance, material, device ] = await Promise.all([
		Scene.root.findFirst('Focal Distance'),
		Materials.findFirst('material0'),
		Scene.root.findFirst('Device')
	]);

	TouchGestures.onTap().subscribe(async (gesture) => {
		const dynamicPlane = await Scene.create('Plane', {
			name: 'Dynamic Plane',
			width: 0.1,
			height: 0.1,
			x: 0,
			y: 0,
			hidden: false,
			material: material
		});

		// Add the dynamic plane as a child of the Focal Distance object in the Scene panel
		device.addChild(dynamicPlane);

		const vector = Reactive.vector(0, 0, -1);

		const rotatedVector = vector.rotate(dynamicPlane.transform.rotation);

		// Set the velocity using delta time
		const velocity = Time.deltaTimeMS.div(3000).mul(rotatedVector);

		// Animate the cube along its forward vector at the velocity specified
		dynamicPlane.worldTransform.position = dynamicPlane.worldTransform.position.history(1).frame(-1).add(velocity);

		// Time Driver allows you to specify a duration in milliseconds for the
		// animation along with optional parameters for looping and mirroring.
		const timeDriverParameters = {
			durationMilliseconds: 1000,
			loopCount: 1,
			mirror: false
		};

		// Create a TimeDriver using the above parameters
		const timeDriver = Animation.timeDriver(timeDriverParameters);

		timeDriver.start();

		timeDriver.onCompleted().subscribe((event) => {
			//Scene.destroy(dynamicPlane);
			Diagnostics.log('should destroy');
		});
	});
})();
