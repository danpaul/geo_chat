## About
This is a test/learning project using React Native and Firebase. The app allows users to leave notes about locations that are only viewable to other users when they are in close geographical proximity to the location.

## Running on Android
* run: `react-native run-android`
* debug: `adb reverse tcp:8081 tcp:8081`

## Todo
* Sort notes by recency (most recent at top)
* Android
  * Update map config: https://github.com/airbnb/react-native-maps/blob/master/docs/installation.md
* Profile
  * Set username on register
  * Allow profile image
  * Split login/register page
  * Add profile view, allow updates
* Notes
  * Integrate camera functionality
  * Add optional image to note
* Map
  * Show visible range
  * Only allow user to view notes within given range
* locations
  * Add validation to prevent locations too near each other
* Add Firebase validation and authorization to DB and file storage
* Cleanup geofire index on location delete
* Handle adding/removing listeners to locations as user's location changes

## notes
* Firebase timestamp: https://github.com/angular/angularfire2/issues/211
