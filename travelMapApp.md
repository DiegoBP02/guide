Source code: https://github.com/safak/youtube/tree/mern-travel-app

#### Basics

- create backend and frontend folder
- install express and mongoose in backend
- require express, mongoose and set app
- listen to port and log
- install nodemon
- npm init
- script - start: nodemon index.js
- npm start
- create db folder
- create connect.js
- setup connectDB(url)
- get connection string
- setup as MONGO_URL in .env
- provide credentials and DB Name
- require dotenv
- config
- in server.js create start() function
- try await for connect db
- listen to port
- catch error
- invoke start

### Models

- create models and routes folders
- create Pin.js and User.js

## User.js

- create UserSchema
- username: string, required, minmax, unique
- email: string, required, max, unique
- password: string, required, min
- timestamps: true
- export User

## Pin.js

- create PinSchema
- username: string, required
- title: string, required, min
- desc: string, required, min
- rating: number, required, minmax
- lat: number, required
- long: number, required
- export Pin

### Routes

- create pins.js and users.js

## pins.js

- create const router require express and config Router()
- create const Pin and require Pin from models
- router.post("/", async (req,res)=>{controller})
- create const newPin = new Pin(req.body)
- app.use(express.json()) in server.js
- create trycatch
- if error, send back 500 response with json(err)
- try create savedPin = await newPin.save()
- if successful, send back 200 and json(savedPin)
- export router
- require pinRouter from routes in index
- before listen set app.use("/api/v1/pins", pinRouter)
- test everything in postman

- create another route, get "/" async
- create trycatch
- if error, send back 500 response with json(err)
- try get pins from await Pin.find()
- send back response, 200 and json pins

## users.js

- setup basics
- router.post("/register", async (req,res)=>{controller})
- create trycatch
- if error, send back 400 response with json(err)
- install bcrypt
- salt password with 10
- create hashedPassword that await for hash and pass the password from req.body and salt
- create const newUser = new User({username:req.body.username, email, password equal to hashedPassword})
- create user const that await newUser.save()
- send back 200 and json user.\_id
- export router
- import in index.js
- set ("/api/v1/users", userRouter)

- router.post("/login", async (req,res)=>{controller})
- create trycatch
- if error, send back 400 response with json(err)
- try create user by findOne with email
- if there is no user, send back 400 with message
- create isPasswordCorrect = await bcrypt.compare and pass password from body and user password
- if it isn't correct, send back status 400 with json with miessage
- if everything's correct, send back 200 and json user (only \_id and username)

### Creating a react app

- navigate to frontend
- npx create-react-app .
- index.html remove meta="theme-color" and link rel for icon
- change title
- add link href to a font and set style ith \* {font-family and margin 0}
- delete everything besides index
- src/ leave only app.js and index.js and set them properly

### Using React Mapbox

- get token
- create REACT_APP_MAPBOX env and add the token
- npm install --save react-map-gl mapbox-gl
- App.js

import React, { useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import { SiGooglemaps } from "react-icons/si";
import { AiFillStar } from "react-icons/ai";
import "./App.css";

function App() {
const [viewport, setViewport] = useState({
latitude: 47.040182,
longitude: 17.071727,
zoom: 4,
});

return (

<div style={{ height: "100vh", width: "100%" }}>
<Map
initialViewState={{
          longitude: 17,
          latitude: 46,
          zoom: 4,
        }}
width="100%"
height="100%"
mapboxAccessToken={process.env.REACT_APP_MAPBOX}
mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
onViewportChange={(viewport) => setViewport(viewport)} >
<Marker longitude={2.294694} latitude={48.858093} anchor="bottom">
<SiGooglemaps
style={{ fontSize: viewport.zoom * 7, color: "slateblue" }}
/>
</Marker>
<Popup longitude={2.294694} latitude={48.858093} anchor="top">
<div className="card">
<label>Place</label>
<h4 className="place">Eiffel Tower</h4>
<label>Review</label>
<p className="desc">Beatiful place. I loved it.</p>
<label>Rating</label>
<div className="stars">
<AiFillStar className="star" />
<AiFillStar className="star" />
<AiFillStar className="star" />
<AiFillStar className="star" />
<AiFillStar className="star" />
</div>
<label>Information</label>
<span className="username">
Created by <b>Diego</b>
</span>
<span className="date">1 hour ago</span>
</div>
</Popup>
</Map>
</div>
);
}

export default App;

- create app.css in src
- import in App.js

- at the end of package json add "proxy":"http://localhost:5000/api/v1"
- npm install axios
- go to backend
- start

### React fetching data from node.js

- App.js, after const viewport, create a useeffect
- create const getPins async with a try catch
- catch log error
- try creating res that await fot axios.get("/pins")
- create pins usestate ith an empty array
- setPins with data coming from res
- before Marker map over pins and se a react fragment
- enclose Marker and Popup in the map
- make the latitude and longitute of Marker and Popup dynamic
- make the with title, description and created by
- npm install timeago.js
- import {format} from "timeago.js
- at date span {format(pin.createdAt)}
- create currentPlaceId usestate with null
- in the icon, onclick will handleMarkerClick invoked by a arrow function and invoke the id from pin
- const handleMarkerClick will receive and id and setCurrentPlaceId equal to id that it receives
- if \_id coming from pin is equal to currentPlaceId, then display the Popup
- create onClose property in Popup and that invoke an arrow function and set current place id equal to null
- add closeButton={true} closeOnClick={false} to Popup
- add cursor pointer to icon style
- temporary, create const currentUser and name it
- in icon, set a condition in color, if pin username is equal to currentUser, set the color to tomato, otherwise it will be slateblue

### React Mapbox adding new Location

- create usestate newPlace null
- create another popup after the map with the same values
- remove lat and long values and add some random text
- comment it for now
- add onDblClick to Map that run handleAddClick
- create handleAddClick arrow function with e as param
- log e and test it
- get long and lat from e.lngLat
- set new place with lat and long object
- uncomment Popup and set a condition, if there is a newPlace, then show the Popup
- set lat and long with values coming from newPlace
- test it
- on close will set new place equal to null
- in the icon, pass the lat and long coming from pin and parameters in handleMarkerClick
- receive lat and long in handleMarkerClick
- set viewport resting the current values and passing lat as latitude and long as longitude
- in the Map, add property transitionDuration equal to 200
- inside new Popup:
<div>
<form>
<label>Title</label>
<input placeholder="Enter a title"/>
<label>Review</label>
<textarea placeholder="Say something about this place"></textarea>
<label>Rating</label>
<select>
  <option value="1">1</option>
  <option value="2">2</option>
  <option value="3">3</option>
  <option value="4">4</option>
  <option value="5">5</option>
</select>
<button className="submitButton" type="submit">Add Pin</button>
</form>
</div>

### React post request using axios

- create usestate title, desc, rating all null
- title input add onChange and invoke setTitle and pass e.target.value, do the same with desc and rating
- create onSubmit in form that handleSubmit (async)
- prevent default
- create newPin equal to a object with username:currentUser, title, desc, rating, lat:newPlace.lat and for long too
- try catch
- log error
- create res const that await for axios post methods that looks for "/pins" and pass newPin
- setPins resting pins and pass res.data
- set new place equal to null
- test in page and check in MongoDB
- remove the stars
- {Array(p.rating).fill(<Star className="star" />)}

### React Login and Register Page

- before Map add:
  {currentUser ? (
  <button className="button logout">Logout</button>
  ) : (
  <div className="buttons">
  <button className="button login">Login</button>
  <button className="button register">Register</button>
  </div>
  )}
- delete currentuser and set it as usestate
- create components folder in src
- add Login.jsx Register.jsx login.css register.css
- import css in proper files
- Add:
  import "./register.css";
  import { SiGooglemaps } from "react-icons/si";
  function Register() {
  return (
  <div className="registerContainer">
  <div className="logo">
  <SiGooglemaps />
  BPPin
  </div>
  <form>
  <input type="text" placeholder="username" />
  <input type="email" placeholder="email" />
  <input type="password" placeholder="password" />
  <button className="registerBtn">Register</button>
  <span className="success">Successful! You can login now!</span>
  <span className="failure">Something went wrong!</span>
  </form>
  <GiCancel className="registerCancel" />
  </div>
  );
  }
  export default Register;
- create useState for success and error both false
- set a condition for success and failure span, if success display success, otherwise failure
- create nameRef emailRef passwordRef using useRef and place it in the input
- form handleSubmit on submit
- create handleSubmit async
- prevent default
- create newUser const where username:nameRef.current.value and do the same for email and passord
- try catch
- catch setError(true)
- await for axios post method to "/users/register" and pass newUser
- setError to false
- setSuccess to true
- App.js add showRegister and showLogin usestate both false
- in login button invoke setShowLogin and set it to true, do the same with register
- if showRegister is true, then display Register, do the same for Login
- pass setShowRegister to Register and do the same for Login
- take it as a prop in register, in register cancel, on click setShowRegister to false
- copy and paste register into login change name and property that it receives
- remove success email

### Using React Local Storage

- App.js create const myStorage equal to window.localStorage
- send it to Login
- in axios set it equal to res const
- Login.jsx after axios myStorage.setItem("user", res.data.username)
- send setCurrentUser to login
- after myStorage.setItem set current user equal to username
- set show login to false
- App.js set on click on logout that handleLogout
- create const handleLogout
- myStorage.removeItem("user");
- set current user null
- set default current user equal to myStorage.getItem("user")
- test everything
