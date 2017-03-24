import firebase from 'firebase';

class Note {
    create({ message, locationId }) {
        return new Promise((resolve, reject) => {
            const user = firebase.auth().currentUser.uid;
            firebase.database().ref(`/notes/${locationId}`)
                .push({ message, user })
                .then(resolve)
                .catch(reject);
        });
    }
}
export const note = new Note();
