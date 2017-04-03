import firebase from 'firebase';

class Note {
    add({ message, locationId }) {
        return new Promise((resolve, reject) => {
            const path = `/locations/${locationId}/notes`;
            const user = firebase.auth().currentUser.uid;
            const timestamp = firebase.database.ServerValue.TIMESTAMP;
            const newPostRef = firebase.database().ref(path).push();
            newPostRef.set({ message, user, timestamp }).then(resolve).catch(reject);
        });
    }
}
export const note = new Note();
