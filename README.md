# WanderMap

## Live Link
[https://expo.dev/@technotech/wandermap](https://expo.dev/@technotech/wandermap)

## Table of Contents
1. [Overview](#id-overview)
2. [Built by](#id-builtby)
3. [Demo](#id-demo)
4. [Installation](#id-installation)
5. [Usage](#id-usage)
6. [Roadmap](#id-roadmap)
7. [Release History](#id-releasehistory)
8. [Authors](#id-authors)
9. [Help/Feedback](#id-help)
10. [Contributing](#id-contributing)
11. [License](#id-license)
12. [Acknowledgements](#id-acknowledgments)


<a name="id-overview"></a>
## Overview
“Don’t be bored” – this is our slogan in reference to Google’s previous slogan “Don’t be evil.” WanderMap is a social networking app that allows users to share events within their own communities and view events within close proximity on a map. Currently, there are event apps such as “Eventbrite” which are geared towards professional use and “Meetup.com” which is a little bit more casual but is not really oriented towards interacting with friends. There are social media apps which can be a bit easier when it comes to sharing events. For example, with “Snapchat” users can share photos in a discreet format and view real-time friend locations. “Instagram” allows users to share photos/videos to their followers in a more public setting. However, they’re more geared towards social interactions and are not the best when it comes to sharing events on a map. WanderMap was created in hope to make it easier for users to discover events, especially when they are spending their days with no particular plans.

Furthermore, this could be a beneficial addition to Alphabet as Google does not currently have a major social media app as one of their products. Having WanderMap could encourage users to upload photos at different locations and if the user chooses to make the image available as a review on Google Maps, that would increase the amount of image data available for their Places API. If WanderMap implemented “likes” as one of the features for user photos and events, Google can also collect a large amount of data to predict user habits and build a better recommendation system across multiple platforms. This would also be a great addition because users can currently Google search for events to see a list of event data scraped from third party websites but they do not have an official platform. If they use WanderMap as a prototype for “Google Events”, it would encourage even more users to use their products. With “Instagram” using Apple Maps and “Snapchat” using Mapbox to display their maps, it would be further beneficial for Google to attempt to compete in a social media app using Google Maps Platform as they have a large database and a wide variety of APIs.

Another motivation behind this project was also to create a platform where users can share what they are up to whilst being more “down to earth”, avoiding the adversarial effects of social media. Currently, most of the major social media platforms involve users becoming in a sense “addicted to” manipulating their online social presence, which could possibly lead to deterioration in one’s mental health. WanderMap attempts to resolve this problem by motivating users to meet up in real life and by having minimal features that could likely cause them to bear negative thoughts. For example, users can share photos from an event they are currently attending to attract their followers to join them. However, they can neither edit photos nor can they upload photos from their own camera roll. Users are also not able to view a list or even the number of followers they have to prevent them from thinking about their online popularity. Instead, they can share events which encourage users to physically meet up and have real life interactions.

<a name="id-builtby"></a>
## Built by
<p float="left">
  <img src="https://raw.githubusercontent.com/rika97/wandermap/5a24cf23cc79401607e957154415eba0907d2720/assets/readme-assets/react-native.svg" width="150">
  <img src="https://raw.githubusercontent.com/rika97/wandermap/5a24cf23cc79401607e957154415eba0907d2720/assets/readme-assets/redux.svg" width="100">
  <img src="https://raw.githubusercontent.com/rika97/wandermap/main/assets/readme-assets/google-maps.png" width="150">
  <img src="https://raw.githubusercontent.com/rika97/wandermap/main/assets/readme-assets/firebase.png" width="200">
</p>

<a name="id-demo"></a>
## Demo
Link to demo video (coming soon)

<a name="id-installation"></a>
## Installation
- **Open with Expo**
    1. Download “Expo” App on App Store and Google Play
    2. Scan the QR code at this URL: [https://expo.dev/@technotech/wandermap](https://expo.dev/@technotech/wandermap)
- **Open on local**:
    1. **Download XCode for OS or "Expo" app on mobile**
    2. **Clone the repo**: 

      git clone https://github.com/rika97/wandermap.git
    3. **Install dependencies:**

      npm install
    4. **Get an API key for Firebase** (Free with Spark plan)
        - Go to [Firebase console](https://console.firebase.google.com/)
        - Click on "Add project"
        - Go to "project settings" → "add app", and create a new web app
        - Add firebase SDK using npm
        - Copy and paste credentials to firebaseConfig inside App.js
    5. **Get an API key for Google Maps API** (90-day $300 free trial with $100 bonus for organization free trial)
        - Go to [Google Cloud console](https://console.cloud.google.com/)
        - Create a new project
        - Navigate to Google Maps Platform → Credentials → Create Credentials → API key
        - Copy and paste the API key to:
            - api_key in Map.jsx
            - ios.googleMapsApiKey and android.config.googleMaps.apiKey in app.json
            - api_key in Createevent.jsx
            - api_key in Addphoto.jsx
    6. **Start the app**

              npm start

        Enter “i” to open with XCode Simulator or scan QR 
        code with a mobile device to run on Expo App.

<a name="id-usage"></a>
## Usage
<p float="left">
  <img src="https://raw.githubusercontent.com/rika97/wandermap/main/assets/readme-assets/landing.PNG" width="150">
  <img src="https://raw.githubusercontent.com/rika97/wandermap/main/assets/readme-assets/register.PNG" width="150">
  <img src="https://raw.githubusercontent.com/rika97/wandermap/main/assets/readme-assets/account.PNG" width="150">
  <img src="https://raw.githubusercontent.com/rika97/wandermap/main/assets/readme-assets/profile.PNG" width="150">
</p>
<p float="left">
  <img src="https://raw.githubusercontent.com/rika97/wandermap/main/assets/readme-assets/autocomplete.PNG" width="150">
  <img src="https://raw.githubusercontent.com/rika97/wandermap/main/assets/readme-assets/directions.PNG" width="150">
  <img src="https://raw.githubusercontent.com/rika97/wandermap/main/assets/readme-assets/cluster.PNG" width="150">
  <img src="https://raw.githubusercontent.com/rika97/wandermap/main/assets/readme-assets/eventDetails.PNG" width="150">
</p>
<p float="left">
  <img src="https://raw.githubusercontent.com/rika97/wandermap/main/assets/readme-assets/categories.PNG" width="150">
  <img src="https://raw.githubusercontent.com/rika97/wandermap/main/assets/readme-assets/photosfeed.PNG" width="150">
  <img src="https://raw.githubusercontent.com/rika97/wandermap/main/assets/readme-assets/camera.PNG" width="150">
</p>

Users can view their own events and photos in their account page, search for locations via name using autocomplete and Places API. 

Users can also click on event markers to view more details and a route will be drawn from their current location for navigation using Distance Matrix API.

"Get Directions" button will cause the app to open Google Maps and start a navigation from the user's current location to event location.

Event markers also appear in clusters when markers focus at a particular location. Users can also tap on "Community" to switch to photos posted by users following. 

Photo markers are deleted from the map after 24 hours of posting and event markers are deleted after event end date has passed. 

Events can be viewed in the events tab and can also be filtered using categories. User photos can be viewed in the photos tab and users can also search for other users in the search bar to navigate to their profiles and follow them.

View [demo video](#id-demo) for more details.


<a name="id-roadmap"></a>
## Roadmap
- [ ] Show event posts in Google search, upload user photos to Google Maps reviews
- [ ] Display events in close proximity even if the user is not following the host of the event
- [ ] Add usernames to each user so that users with the same name do not show in search
- [ ] Add visibility feature (private, public, block, report) to user posts and accounts
- [ ] Account CRUD - enable editing on user profiles, deleting accounts, forgot password
- [ ] Add “groups” feature - make users able to group their friends using lists
- [ ] Event tags - add hashtags to events and posts to make a more functional search bar
- [ ] Share feature - enabling sharing photos to other apps, enable .ics file (calendar) exports
- [ ] More camera features -more natural camera zoom-in, use TensorFlow to identify objects in photo and predict captions
- [ ] Messaging feature - enable users to send DMs each other
- [ ] “Going/Interested” & “like” feature - enable users to interact with user events and photos
- [ ] Build recommendation system to predict user’s favorite events/photos and show them in feed in that order
- [ ] Notifications - enable push notifications when an event marked as “going” is approaching
- [ ] Ticketing system - create an original ticketing system so that users don’t have to deal with third party apps.
- [ ] Increased log-in options - add major services such as Google and Facebook
- [ ] Implement more security features - 2fac authorization, email verification, find better ways to store API keys
- [ ] Optimize performance 
    - [ ] Fetching user location with Expo geolocation takes time, consider switching to Google Maps Geolocation API, which also allows fetching location without depending on GPS.
    - [ ] A lot of bandwidth is required to render contents in the app, especially rendering user uploaded images. Consider using low resolutions.
- [ ] Increase in variety of languages offered
- [ ] Create web version of app

<a name="id-releasehistory"></a>
## Release History
- **V1.0.1** - First Release with UI fixes (Nov 6 2022)
- **V1.0.0** - First Release (Nov 1 2022)

<a name="id-authors"></a>
## Authors
[@rika97](https://github.com/rika97/)

<a name="id-help"></a>
## Help/Feedback
To report a bug or suggest a new idea, submit an [issue](https://github.com/rika97/wandermap/issues).

If you have any further questions, comments, or concerns, please contact at this email address:

📩 technotechapps@gmail.com

<a name="id-contributing"></a>
## Contributing
Any contributions you make are greatly appreciated! 
1. Fork this repository to create a copy.
2. Clone the forked repository to your machine.
3. Create a branch, make necessary changes and commit those changes.
4. Push your changes to Github.
5. Add an explanation of the features you added to README.md
6. Submit a compare & pull request for review.

Keep in mind that when contributing, WanderMap uses the following default settings:
* **Colors**:
    * Primary: #30b5c7 
    * Secondary: #8abbc2
    * Tertiary: #bce3e8
    * Quaternary: #cfe3e6
    * Error: #FF0000
    * Warning: #143F73
* **Header Font**: [Cocogoose](https://www.dafont.com/cocogoose.font)
* **Timestamps**: UNIX, milliseconds (refer to: [Firebase Timestamp](https://firebase.google.com/docs/reference/kotlin/com/google/firebase/Timestamp))

<a name="id-license"></a>
## License
Distributed under the MIT License. See License.txt for more information.

<a name="id-acknowledgments"></a>
## Acknowledgments
* **UI Inspirations:**
    * ["CariEpent - Event Mobile App"](https://dribbble.com/shots/19356717-CariEpent-Event-Mobile-App) by Asal Dsign
    * ["Event App"](https://dribbble.com/shots/15798437-Event-App) by Radovan Tucek
    * ["Circle - Social Networking App"](https://dribbble.com/shots/18370093-Circle-Social-Networking-App) by Happy Tri Milliarta
* **Icons:**
    * [React Native Vector Icons Directory](https://oblador.github.io/react-native-vector-icons/)
* **Fonts:** 
    * "Cocogoose" by [Zetafonts](https://www.zetafonts.com/)
