SELECT make, model, year, email FROM Vehicles
FULL JOIN Users ON Vehicles.ownerId = Users.id
WHERE Users.email = $1;
