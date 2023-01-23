#### Installation

- install express mongoose dotenv multer nodemon
- require express, mongoose and set app
- listen to port and log
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
- use express.json
- in server.js create start() function
- try await for connect db
- listen to port
- catch error
- invoke start

#### Creating models

- create models and routes folder
- models, create User.js, Post.js and Category.js
- routes, create users.js, posts.js, categories.js and auth.js
- User.js, require mongoose
- create UserSchema
- username - string, required, unique
- email - string, required, unique
- password - string, required
- profilePic - string, default:""
- timestamps true
- exports

- create PostSchema
- title - string, required, unique
- desc - string, required
- photo - string, not required
- username - string, required
- categories - array, not required
- timestamps true

- create CategorySchema
- name - string, required
- timestamps true

#### Login and Register routes

### Register

- auth.js require router and invoke
- require User
- use router.method("/route", async (req,res) => {code})
- create register router
- trycatch block
- catch err, if status 500, json err
- try create newUser const equal to new User and pass set username, email and password from what is coming from req.body
- create const user that await for newUser and save
- send back 200 with user
- exports router
- require authRoute with auth route in index.js
- before listen use authRoute with "/api/auth" as route
- test everything in postman

### hash

- install bcrypt
- require bcrypt
- before newUser, create salt that await for 10 genSalt
- create hashed password that await for bcrypt hash method and pass the password coming from body and salt
- change the password coming from body in newUser to hashed password
- test in postman and mongodb

### Login

- create router with post method
- trycatch block
- catch err 500 and json err
- try creating const user that await for findOne method and pass the username as comparison
- if there is no user, send back status 400
- create validate const that awaits for compare bcrypt method and pass the password from body and the password from user
- if it is not valdiate, send back 400
- if everything is okay, send back 200 and json the user
- test in postman
- before status 200, take password and ...others from user.\_doc and send back only other in json

#### NodeJS MongoDB User CRUD

### Update user

- users.js, config router, require User, bcrypt and export router
- create router with put method and /:id route
- if userId from body is equal to params.id, then... else send back 401 status with json warning
- inside if condition, if req.body.password, then create salt const and set req.body.password equal to await bcrypt hash
- trycatch block
- catch err status 500 json err
- try creating updateUser const that await for findByIdAndUpdate, pass the params.id as the first parameter and {$set:req.body} as the second and {new:true} as the third
- send back status 200 with json updatedUser
- setup in index.js
- test in postman

### Delete user

- copy and paste the update user code
- change method to delete
- change json msg
- delete if condition that checks body password
- leave try block empty, except for response
- try await for findByIdAndDelete and pass params.id as parameter
- change response to a msg
- place this try block inside another trycatch
- try create const user that await findById and pass params.id
- if there is a user, then run the delete trycatch
- catch status 404 with msg
- require post
- above findByIdAndDelete, await Post.deleteMany({username:user.username})

### Get single user

- create router with get method and /:id route
- trycatch
- catch 500 json err
- try create user with findById and pass params.id
- get password and others from user.\_doc
- send back 200 with json other
- test in postman

#### Posts

### Create post

- users.js, config router, require User, Post and export router
- create router with post method with "/" route
- create const newPost equal to new Post and pass req.body
- trycatch
- catch status 500 json err
- try creating savedPost equal to await newPost and use save method
- send back 200 savedPost
- setup in index.js
- test in postman

### Update post

- create put router with "/:id" route
- trycatch
- catch 500 json err
- try creating post const that await findById and pass params.id
- if post username is equal to body username, then trycatch, else status 200 json err
- try creating updatedPost const that await for findByIdAndUpdate, pass the params.id as the first parameter and {$set:req.body} as the second and new:true as the third
- send back response 200
- catch err 500 json err

### Delete post

- copy and past update post code
- delete everything inside the trycatch of post.username if, except the response
- change the msg of else err
- try await post.delete()
- change json from response to a msg

### Get single post

- create router with get method and "/:id" route
- trycatch
- catch res 500 json err
- try creating post const that await for findById and pass params.id
- send back 200 response with json post
- test in postman

### Get all posts

- create route with get method and "/" route
- create const username and catName with the values coming from req.query
- trycatch
- catch err 500 json err
- try
- create let posts
- if there is a username, then posts will be equal to await Post.find({username})
- else if there is catName, then posts will be equal to await Post.find({categories:{$in:[catName]}})
- else, set posts equal to await Post.find()
- outside the if blocks, send back res 200 with posts

#### Get and post category

### Post category

- categories.js, config router, require Categories and export router
- create route with post method and "/" route
- create const newCat equal to new Category and pass req.body
- trycatch
- catch err 500 json err
- try create const savedCat that await for newCat with save method
- send back 200 with savedCat
- setup in index.js

### Get category

- create route with get method and "/" route
- trycatch
- catch 500 err
- try creating cats that await for Category.find()
- send back res 200 with cats

#### Upload file

- create images folder
- index.js, require multer and path
- below express.json()
- app.use("/images", express.static(path.join(\_\_dirname, "/images")));
- above app.use
- const storage = multer.diskStorage({
  destination:(req,file,cb) => {
  cb(null,"images")
  },filename:(req,file,cb) => {
  cb(null, "hello.jpeg") // normal would be req.body.name
  }
  })
  const upload = multer({storage:storage})
  app.post("/api/upload", upload.single("file"),(req,res)=>{
  res.status(200).json("File has been uploaded")
  })
- test in postman, change raw to form-data, key file and value file, choose one image and send
