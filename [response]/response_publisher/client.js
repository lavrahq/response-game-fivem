var TrackedVehicles = {};

on("onClientResourceStart", (resource) => {
	if (resource == GetCurrentResourceName()) {
		RunUpdate();
	}
})

// Vehicle Tracking
RegisterCommand("track", (source, args, raw) => {
	const ped = GetPlayerPed(-1);
	const vehicle = GetVehiclePedIsIn(ped, false);
	if (vehicle != 0 && vehicle != null) {
		const vehiclePos = GetEntityCoords(vehicle, false);
		const plate = GetVehicleNumberPlateText(vehicle);
		const [ streetHash, crossStreetHash ] = GetStreetNameAtCoord(vehiclePos.x, vehiclePos.y, vehiclePos.z);
		emitNet("Response:CheckVehicleTracked", {
			vehiclePos,
			streets: {streetHash, crossStreetHash},
			vehicleType: GetVehicleType(vehicle),
			vehiclePlate: plate,
			vehicleSpeed: GetEntitySpeed(vehicle),
			vehicleHandle: vehicle
		});
	}
}, false)

onNet("Response:TrackVehicle", () => {
	const ped = GetPlayerPed(-1);
	const vehicle = GetVehiclePedIsIn(ped, false);
	if (vehicle != 0 && vehicle != null) {
		const vehiclePos = GetEntityCoords(vehicle, false);
		const plate = GetVehicleNumberPlateText(vehicle);
		const [ streetHash, crossStreetHash ] = GetStreetNameAtCoord(vehiclePos.x, vehiclePos.y, vehiclePos.z);
		if (TrackedVehicles[plate] == undefined) {
			TrackedVehicles[plate] = {
				vehiclePos,
				streets: {streetHash, crossStreetHash},
				vehicleType: GetVehicleType(vehicle),
				vehiclePlate: plate,
				vehicleSpeed: GetEntitySpeed(vehicle),
				vehicleHandle: vehicle
			}
			console.log(JSON.stringify(TrackedVehicles[plate], null, 2));
		}
	}
})

function RunUpdate() {
	setTimeout(() => {
		if (Object.keys(TrackedVehicles).length > 0) {
			for (let key in TrackedVehicles) {
				const vehicle = TrackedVehicles[key].vehicleHandle
				const vehiclePos = GetEntityCoords(vehicle, false);
				const [ streetHash, crossStreetHash ] = GetStreetNameAtCoord(vehiclePos.x, vehiclePos.y, vehiclePos.z);
				const vehicleSpeed = GetEntitySpeed(vehicle);
				TrackedVehicles[key].vehiclePos = vehiclePos;
				TrackedVehicles[key].streets = { streetHash, crossStreetHash };
				TrackedVehicles[key].vehicleSpeed = vehicleSpeed;
			}
			emitNet("Response:RecieveTrackedVehicles", TrackedVehicles);
		}
		RunUpdate();
	}, 10000);
}

function GetVehicleType(vehicle) {
	let model = GetEntityModel(vehicle);
	if (IsThisModelACar(model)) {
		return "Car"
	} else if (IsThisModelABicycle(model)) {
		return "Bicycle"
	} else if (IsThisModelABike(model)) {
		return "Motorcycle"
	} else if (IsThisModelABoat(model) || IsThisModelAnEmergencyBoat(model)) {
		return "Boat"
	} else if (IsThisModelAHeli(model)) {
		return "Heli"
	} else if (IsThisModelAPlane(model)) {
		return "Plane"
	} else {
		return "Car"
	}
}