#### fetch data from database

- run backend and frontend
- install axios in frontend
- in backend package.json, add "proxy":"http://localhost:5000/api/"
- home.jsx create posts usestate equal to an empty array
- create useffect with async fetchPosts const that assigns to a const the result of axios get method with /posts route and set the posts equal to the data coming from the response
- invoke fetchPosts
- send posts as an parameter to Posts components

#### displaying all posts on the homepage

- posts.jsx
- remove the components and set a map over posts (receive it as an parameter first) and render Post sending post from map as an parameter
- post.jsx
- receive post as an parameter
- the data you want that is coming from post is title, createdAt (new Date(createdAt).toDateString()), description, check, if there is an photo, only then display it
- delete span from categories and use map in categories, return a span.postCat with category name

#### React router dom using dynamic link

- import Link from react router dom
- use link to /post/${id}, with \_id coming from post, also place title inside it, also add link className to it
- singlepost.jsx
- set location equal to useLocation(), get it from react router
- set path = location.pathname.split("/")[2]

#### fetching single post using axios

- create useeffect that re-renders when path changes
- create async getPost const that assigns to a const the result of axios get method with /posts/ + path route
- create post usestate equal to an empty object
- set post equal to the data coming from axios response
- set a condition where, if there is a photo coming from post, then display the image, set the img src equal to photo coming from post
- display title dynamically
- change author to username
- change date to createdAt
- change desc

#### fetching all categories

- sidebar.jsx
- create usestate cats as an empty array
- create useeffect
- create async getCats that await for axios get "/categories"
- setCats equal to the data coming from response
- invoke getCats
- change categories to a map over name property of cats

#### how to use query in axios

- home.jsx
- create {search} = useLocation()
- add search to route in axios
- in singlePostAuthor span, create a Link envolving post.username
- link to /?user=(username coming from post) add link classname
- sidebar.jsx, do the same, but link to /?cat=(name from cat)

#### register system

- usestate username empty string
- usestate email empty string
- usestate password empty string
- set onChange with setName with e.target.value
- add type submit to button
- add onSubmit to form firing handleSubmit
- create async handleSubmit taking (e)
- prevent default
- create const res that await for axios post and pass "/auth/register" and {username,email,password})
- place it inside a trycatch block
- usestate error false
- catch error setting error to true
- at the end of try, add: res.data && window.location.replace("/login")
- after prevent default, setError to false
- after the button, if error is true, then display an span saying that something went wrong, give and style of color red and margin top of 10px

#### context api best practices

- create context folder with actions.js context.js reducer.js files
- context.js
- create INITIAL_STATE const with an object an place:
- user null
- isFetching and error false
- import createContext, useReducer from react
- export const Context = createContext(INITIAL_STATE)
- export const ContextProvider = ({children}) =>{}

- actions.js
- export const LoginStart = (userCredentials) => ({type: "LOGIN_START"})
- export const LoginSuccess = (user) => ({type: "LOGIN_SUCCESS", payload:user})
- export const LoginFailure = () => ({type: "LOGIN_FAILURE"})

- reducer.js
- const Reducer = (state, action)=>{
  switch(action.type){
  case "LOGIN_START":
  return{
  user: null,
  isFetching: true,
  error: false,
  }
  default: return state;
  }
  }
- following this logic, if login success, user: action.payload, isFetching: false, error:false
- case login failure, user null , isFetching false and error true
- export default Reducer

- context.js
- const [state, dispatch] = useReducer(Reducer, INITIAL_STATE)
- return <Context.Provider value={{user:state.user, isFetching:state.isFetching, error:state.error, dispatch}}>{children}<Context.Provider/>

- index.js
- cover App with ContextProvider

#### login system

- change label and input email -> username
- register button type = submit
- add onSubmit to form that fires handleSubmit
- create const userRef and passwordRef = useRef()
- create const async handleSubmit that receives e, prevent default
- add them to user and password input
- get dispatch and isFetching through useContext(Context)
- on handleSubmit, add dispatch type LOGIN_START
- create trycatch block
- try create res const with await post axios method with "/auth/login" route and pass username and password equal to their proper useRef.current.value
- if it works, dispatch LOGIN_SUCCESS also send data from res as payload
- catch error dispatching LOGIN_FAILURE

#### using local storage with context api

- create useEffect(()=>{
  localStorage.setItem("user", JSON.stringify(state.user))
  },[state.user])
- change user from initial state to JSON.parse(localStorage.getItem("user")) || null
- login button disabled if fetching
- in app and topbar, get user from useContext(Context)

#### logout using context

- actions, create Logout that dispatch LOGOUT
- reducer, case logout, user null, isFetching and error false
- topbar, for logout, add onClick = handleLogout
- import dispatch from useContext
- create const handleLogout that dispatch LOGOUT
- topbar change img src of profile pic to user.profilePic

#### creating new post using axios

- write.jsx
- create title usestate empty string
- create desc usestate empty string
- create file usestate empty string
- get user from useContext
- type submit to submit button
- form onSubmit handleSubmit
- create async handleSubmit, prevent default, create const newPost set it equal to an object with {username:user.username, title, desc}
- check:
  if (file) {
  const data = new FormData()
  const filename = Date.now() + file.name
  data.append("name", filename)
  data.append("file", file)
  newPost.photo = filename
  try await axios.post("/upload", data)
  catch err
  }
- after the if condition, create a trycatch block
- try creating res const that awaits for axios post method with "/posts" url and pass newPost
- window.location.replace("/post/" + res.data.\_id)
- in return, set a condition where, if there is a file, then display the image with src={URL.createObjectURL(file)}
- in file input, create onChange={e=>setFile(e.target.files[0])}
- in title and desc input, do the same
- in post.jsx, create const PF = "http://localhost:5000/images/"
- in img, chance the src to {PF + post.photo}
- singlepost.jsx, create const PF = "http://localhost:5000/images/"
- in img, chance the src to {PF + post.photo}
- after title, set a condition that checks if the username from post is equal to username from user, if it is, then display the buttons of edit and delete, also use ?.user, so it doesnt throw an error if there is no user
- get user from useContext(Context)

#### delete post

- on delete icon, add onClick firing handleDelete
- create handleDelete async
- create trycatch block
- try await for axios delete method with "/posts/" + path route, and pass {data:{username:user.username}} as the second parameter
- also add: window.location.replace("/")

#### update post

- create title and desc usestate empty string
- create updateMode usestate false
- add onClick on edit icon with an arrow function setting updateMode to true
- above title h1, check if updateMode is true, if it is display input type text value={post.title} and autoFocus className="singlePostTitleInput" else display the h1
- do the same thing to description, but with textarea, value of post.description and the same className
- CSS:
  singlePostTitleInput{
  margin: 10px;
  font-family:"Lora", serif;
  font-size: 28px;
  text-align:center;
  border:none;
  color: gray;
  border-bottom: 1px solid lightgray
  }
  singlePostTitleInput:focus{
  outline:none;
  }
  singlePostWrapper{
  padding:20px;
  padding-right:0;
  display:flex;
  flex-direction:column;
  }
  .singlePostDescInput{
  border:none;
  color:#666;
  font-size:18px;
  line-height:25px;
  }
  .singlePostDescInput{
  outline:none;
  }
- in getPost const, add setTitle and setDesc with title and desc coming from res.data
- take off the post. from value of title and description
- in textarea, add onChange with an arrow function passing e as an parameter that setDesc to the current value
- do the same with title
- after description paragraph, add button.singlePostButton with Update as text
- CSS:
  singlePostButton{
  width: 100px;
  border:none;
  background-color:teal;
  padding:5px;
  color:white;
  border-radius:5px;
  cursor:pointer;
  align-self:flex-end;
  margin-top:20px;
  }
- add onClick on update button that fires handleUpdate
- create async handleUpdate const, copy and paste the code from handleDelete
- change axios method to put
- add title and desc to the request
- remove data
- setUpdateMode to false
- set a condition where, if updateMode is true, only then display the update button
- change title from h1 to only title and do the same to desc

#### updating user using context api

- add cursor pointer to topImg in topbar.css
- topbar.jsx, cover the profile image with a Link component
- add to="/settings"
- settings.jsx
- change image src to user.profilePic
- get user from useContext(Context)
- create file usestate null
- copy and paste handleSubmit const from write.jsx to settings.jsx
- change newPost to updatedUser
- change username to userId: user.\_id
- create username, email, password usestate with empty string
- pass username, email and password to axios
- in if condition, change newPost to updateUser with profilePic instead of photo
- change axios method to put and route "/users/" + user.\_id and send updatedUser
- remove window
- remove const res, leave only the await and axios
- in the file input, onChange={(e)=>setFile(e.target.files[0])}
- change placeholder of username to placeholder={user.username}
- do the same for email
- in username input and onChange that set username to target value
- do the same for email and password
- add type submit to button
- add onSubmit to form that fires handleSubmit
- create success usestate false
- after axios that uploads user, setsuccess to true
- after update button, if success is true, add span with "Profile has been updated", add color green and text-align center, marginTop 20px to style
- in img src, add: {file ? URL.createObjectURL(file): user.profilePic}

- in actions.js, copy and paste loginStart, loginSuccess and loginFailure and only change the name to update
- in reducers.js, copy and paste de case for login, change the name to update
- updateStart return ...state, isFetching:true
- updateFailure with set user to state.user
- in setting.jsx, import dispatch from useContext
- after preventDefault, dispatch UPDATE_START
- if try block is successful, dispatch UPDATE_SUCCESS
- add const res to await axios and set the payload to res.data
- catch error dispatching UPDATE_FAILURE
- create const PF = "http://localhost:5000/images/"
- in img src add PF + before user.profilePic
- do the same thing to img in topbar.jsx
