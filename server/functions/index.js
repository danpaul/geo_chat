/* eslint-disable */

// To deploy: firebase deploy --only functions

var functions = require('firebase-functions');
var admin = require('firebase-admin');
var GeoFire = require('geofire');

admin.initializeApp(functions.config().firebase);

exports.locations = functions.https.onRequest((req, res) => {
    var db = admin.database();
    var ref = db.ref('/locations');
    // Attach an asynchronous callback to read the data at our posts reference
    ref.on('value', function(snapshot) {
        var locations = snapshot.val();
        // res.status(200).send(locations);
        res.status(200).send(JSON.stringify(locations));
    }, function (errorObject) {
        console.log('Locations read failed: ' + errorObject.code);
    });

});

exports.test = functions.https.onRequest((req, res) => {
    res.status(200).send('ok');
});

exports.addToGeoIndex = functions.database.ref('/locations/{locationId}')
    .onWrite(event => {

        // Create a GeoFire index
        var geoFire = new GeoFire(admin.database().ref('/locations-geofire'));
        var db = admin.database();
        var ref = db.ref('/locations/' + event.params.locationId);

        // Attach an asynchronous callback to read the data at our posts reference
        ref.on('value', function(snapshot) {

            var location = snapshot.val();

            geoFire.set(event.params.locationId,
                        [location.latitude, location.longitude])

            .then(function() {
                console.log('success saving location;')
            }, function(error) {
                console.log("Error saving location: ", error);
            });
        }, function (errorObject) {
            console.log('Location read failed: ' + errorObject.code);
        });
    });
