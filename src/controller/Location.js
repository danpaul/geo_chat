import firebase from 'firebase';
import config from '../config';
import { note } from './index';

class Location {
    create({ latitude, longitude, title, message }) {
        return new Promise((resolve, reject) => {
            firebase.database().ref('/locations')
                .push({ latitude, longitude, title })
                .then((snap) => {
                    const locationId = snap.key;
                    note.create({ message, locationId })
                        .then(resolve)
                        .catch(reject);
                })
                .catch(reject);
        });
    }
    // gets locations surrounding given location
    get({ latitude, longitude }) {
        firebase.database().ref('locations')
            .orderByChild('latitude')
            .startAt(latitude - config.geoRadius)
            .endAt(latitude + config.geoRadius)
            .orderByChild('longitude')
            .startAt(longitude - config.geoRadius)
            .end(longitude + config.geoRadius)
            .on('child_added', (snapshot) => {
                // asdf
                console.log('got snapshot');
                console.log(snapshot.key);
            });
    }
}
export const location = new Location();
