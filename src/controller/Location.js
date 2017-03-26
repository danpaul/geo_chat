import firebase from 'firebase';
import { note } from './index';

class Location {
    create({ latitude, longitude, title, message }) {
        return new Promise((resolve, reject) => {
            firebase.database().ref('/locations')
                .push({ latitude, longitude, title, notes: [] })
                .then((snap) => {
                    const locationId = snap.key;
                    note.add({ locationId, message })
                        .then(resolve)
                        .catch(reject);
                })
                .catch(reject);
        });
    }
}
export const location = new Location();
