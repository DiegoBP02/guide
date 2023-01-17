#### Basics

- require ("dotenv").config()
- require express
- const app invokes express
- app.use(express.json())
- create connectDB file inside the db folder
- require mongoose
- const connectDB = (url) =>{
  return mongoose.connect(url)
  }
- exports
- require connectDB in app.json
- declare const port
- declare async start const
- trycatch block inside start
- try awaiting for the connectDB(.env.MONGO_URI)
- app.listen(port,()=>log(server is listening...))
- log error in catch block
- invoke start

#### Middlewares

- require notFoundMiddleware from middleware folder
  const notFound = (req, res) => res.status(404).send('Route does not exist')
  module.exports = notFound
- require errorHandlerMiddleware from middleware folder
  // const { CustomAPIError } = require("../errors");
  const { StatusCodes } = require("http-status-codes");
  const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
  // set default
  statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  msg: err.message || "Something went wrong try again later",
  };
  // if (err instanceof CustomAPIError) {
  // return res.status(err.statusCode).json({ msg: err.message });
  // }
  if (err.name === "ValidationError") {
  customError.msg = Object.values(err.errors)
  .map((item) => item.message)
  .join(", ");
  customError.statusCode = 400;
  }
  if (err.name === "CastError") {
  customError.msg = `No item found with id : ${err.value}`;
  customError.statusCode = 404;
  }
  if (err.code && err.code === 11000) {
  customError.msg = `Duplicate value entered for ${Object.keys( err.keyValue )} field, please choose another value`;
  customError.statusCode = 400;
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.statusCode).json({ msg: customError.msg });
  };
  module.exports = errorHandlerMiddleware;

#### Errors

- copy and paste errors folder from another project

#### Models

- create models folder and Model.js file
- create schema with the proper values
  module.exports = mongoose.model("Model", ModelSchema)
  -s

#### Create routes structures

- create controllers folder
- add the controller file
- require proper model
- require StatusCodes
- require the errors that will be used
- create res.send functions and export them
- create routes folder
- setup the routes file
- require express
- require const router = express.Router()
- import all controllers
- setup the routes
- export router
- import the routes as router in the app.js // just my preference
- setup app.use("path/v1/example", exampleRouter)

#### Test routes in postman

#### Register controller (simple version)

- create user with rest req.body
- send response with entire user (only while testing)
- check if email is already in use (schema and controller)

### Hash password

- pull out the values from req.body, normally it will be name, email, password

### testing

- follow the code for hashing password (temporary setup)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password,salt)
  const tempUser = {name,email,password:hashedPassword}
  pass the temp User in the create

### final

- follow the code in the Model for hashing the password (final setup)
  UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  })
  refactor controller code to what it was at the beginning

### JWT (without cookies)

### testing

- in the register controller, create the signed token:
  const token = jwt.sign({userId:user.\_id,name:user.name},"jwtSecret",{
  expiresIn:"30d",
  })
- take off the password of the response and send the name inside the user property and the token separately

### final

- take off the previous setup of the token in the User controller
- require "jsonwebtoken" package in Model.js
- create jwt - jwt.sign(payload,secret,options)
  UserSchema.methods.createJWT = function () {
  return jwt.sign(
  { userId: this.\_id, name: this.name },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_LIFETIME, }
  );
  };
- const token invokes user.createJWT, pass the token in the response
- invoke user.createJWT in the controller and attach to token const
- add variables in .env JWT_SECRET=jwtSecret and JWT_LIFETIME=1d
- restart the server

#### Login controller (simple version)

- get the email and the password from the req.body
- if one is lacking, then throw bad request error
- setup user const that await for the findOne and pass the email
- if there is no user, throw unauthenticated error
- create a jwt token for the user
- send back response

### compare hashed password

- create a comparePassword method in model with the following code:
  UserSchema.methods.comparePassoword = async function (candidatePassword){
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
  }
- if there is a user, check if the password is correct with isPasswordCorrect const, that awaits the method comparePassword in the user and pass the password as an parameter
- if the password doesn't match, throw a unauthenticated error

### authenticate header

- require authenticateUser from middleware folder in the app.js
  const jwt = require("jsonwebtoken");
  const { UnauthenticatedError } = require("../errors");
  const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
  throw new UnauthenticatedError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  // attach the user to the job routes
  req.user = { userId: payload.userId, name: payload.name };
  next();
  } catch (error) {
  throw new UnauthenticatedError("Authentication invalid");
  }
  };
  module.exports = auth;
- put the authenticateUser between the path and the router in the app.use

#### CreateJob

- set the req.body.createdBy equal to userId
- create job and pass the req.body, attach it to a const
- send back response

#### GetAllJobs

- create jobs const that await for the Jobs.find and get the ones that the createdBy and the userId matches
- optional: you can sort by the createdAt
- send back the jobs in the response, also, you can add the jobs.length to a count property

#### GetJob

- take the userId from req.user
- take the id from the params, you can rename it if you want
- create job const that awaits for the job.findOne, pass the \_id and the jobId as match parameter and if the userId matches the createdBy
- if there is no job, throw not found error
- send back response

#### UpdateJob

- take company and position from req.body
- take userId from req.user
- take id from req.params, you can rename it if you want, recommended name: jobId
- if company or position is equal to a null string, throw bad request error warning that these fields cannot be empty
- create const job through findByIdAndUpdate, the first parameter will be if the \_id and the jobId matches and if the userId matches the createdBy, pass the req.body as the second parameter, and pass {new:true, runValidators:true} as the third parameter
- if there is no job, throw not found error
- send back response

#### DeleteJob

- take userId from req.user
- take id from req.params, you can rename it if you want, recommended name: jobId
- create job const through findByIdAndRemove, pass the \_id and the jobId as match parameter and the createdBy to userId
- if there is no job, throw not found error
- send back response

#### Security Packages

- express-rate-limiter // limit the requests for api addresses
- helmet // security related to http response headers
- xss-clean // sanitize the user input
- express-mongo-sanitize // protect against mongoDB injections
- cors (cookies!!!!) // allows access from different domains
