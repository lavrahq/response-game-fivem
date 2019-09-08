let TrackedVehicles = {};

onNet("Response:RecieveTrackedVehicles", (vehicles) => {
	for (let key in vehicles) {
		TrackedVehicles[vehicles[key].vehiclePlate] = vehicles[key];
		console.log(JSON.stringify(TrackedVehicles[vehicles[key].vehiclePlate], null, 2));
	}
})

onNet("Response:CheckVehicleTracked", (vehicle) => {
	if (TrackedVehicles[vehicle.vehiclePlate] == undefined) {
		console.log("ADDING TRACKED VEHICLE!");
		TrackedVehicles[vehicle.vehiclePlate] = vehicle;
		emitNet("Response:TrackVehicle", source);
	}
	else {
		console.log("THIS VEHICLE IS ALREADY TRACKED!");
	}
})

// Add Delayed POST Update
// Add Subscription For Tracked Vehicles