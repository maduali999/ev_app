const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();
const cors = require('cors');
const { createUser, checkUserDetails, getUser, updateUser, getType } = require('./registerUser');
const { createCar, getCars, deleteCar } = require('./carDetails');
const {createplace, updatePlace, getPlacesByUserId} = require('./placeDetails')

app.use(express.json());
app.use(cors());

// Route Definitions
app.post('/createUser', createUser);
app.post('/createCar', createCar);
app.post('/createPlace', createplace);
app.post('/updatePlace', updatePlace)
app.get('/getPlaces', getPlacesByUserId);
app.get('/checkUserDetails', checkUserDetails);
app.get('/getUser', getUser);
app.get('/getType', getType);
app.get('/getCars', getCars);
app.put('/updateUser', updateUser);
app.delete('/deleteCar', deleteCar);

const options = {
    key: fs.readFileSync('C:/Users/madua/key.pem'),
    cert: fs.readFileSync('C:/Users/madua/cert.pem')
};


https.createServer(options, app).listen(4000, "192.168.0.172", () => {
    console.log('HTTPS Server is running on port 4000');
})