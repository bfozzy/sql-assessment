SELECT make, model, year, firstname FROM Vehicles
FULL JOIN Users ON Vehicles.ownerId = Users.id
WHERE firstname LIKE $1;
