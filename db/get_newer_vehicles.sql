SELECT make, model, year, firstname, lastname FROM Vehicles
FULL JOIN Users ON Vehicles.ownerId = Users.id
WHERE year > 2000
ORDER BY year DESC;
