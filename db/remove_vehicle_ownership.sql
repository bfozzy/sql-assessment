UPDATE Vehicles
SET ownerId = null
WHERE id = $1;
