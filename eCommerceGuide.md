#### Setup proper app.js

#### User Model

- create model folder
- create UserSchema with:
- name: string, required
- email: string, required, unique
- require validator package
- in email object: validate:{validator:validator.isEmail,message:"please provide valid email"}
- password: string, required
- role: strinmg, enum: admin and user, user as default

#### Auth Routes Structure

- create controllers folder
- add authController file
- export (register,login,logout) functions
- res.send('some string value')
- create routes folder
- setup authRoutes file
- require express
- create const router equal to express and invoke Router
- import all controllers
- setup three routes
  router.method("/xxx", xxx)
- post('/register') post('/login') get('/logout')
- exports
- import authRoutes as authRouter in the app.js
- setup app.use('/api/v1/auth', authRouter)

#### Test routes in postman

#### Register

- get email, name and password from req.body
- const isFirstAccount = await User.countDocuments({}) === 0
- create const role with ternary operator, if its first account then the role is admin, otherwise the role is user
- create const user that await for user.create() and pass name,email,password and role
- send back response

#### Hash password

- follow the code in the Model for hashing the password (final setup)
  UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  })
- comparePassword
  UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
  }

#### JWT

## testing

- require "jsonwebtoken" package
- create const tokenUser and pass name, userId and role from the user.
- create const token = jwt.sign(payload,secret,options), tokenUser, "jwtSecret", {expiresIn:"1d"}
- pass the tokenUser as user in the response and the token separately
- test in postman

## final

- create utils folder
- create jwt.js
- require jsonwebtoken
- create const createJWT and pass the payload as an object
- create const token equal to jwt.sign(payload,secret,options) - take the last two parameters from .env
- return token
- create const isTokenValid and pass the token as an object and with the arror function verify the token - jwt.verify(token, secret)
- exports
- create index.js in the utils
- import and export functions
- require createJWT in the authcontroller
- in the register controller, invoke createJWT in the token const and pass tokenUser as payload
- test in postman

#### Cookies Setup

- create const oneDay equal to 24h in ms
- send back res.cookie("token", token, {
  httpOnly:true,
  expires: new Date(Date.now() = oneDay)
  })
- test in postman if the cookie has appeared

#### Parse Cookies

- in app.js, require cookie-parser package
- set app.use and invoke cookieParser
- create another app.get with /api/v1 path and log req.cookies
- if you receive the cookie in the log, everything's working fine

#### Refactor cookies setup

- in the jwt.js
- create const attachCookiesToResponse that receives res and user as parameter
- take off token and one day const and res.cookie from register controller and paste it in the attachCookiesToResponse
- setup the proper payload for the createJWT
- exports
- import and exports in index.js
- import attachCookiesToResponse in authController
- invoke it in register and pass res and tokenUser as user

#### Signed and secure flags

- in the res.cookie add secure: process.env.NODE_ENV === "production" and signed: true // secure restricts browser to send cookies only over to https and with signed, the cookie will still be visible but with a signature, so it can be detected if the client modified the cookie
- pass the assignature in the app.use cookieParser
- now the cookies will be stored in the req.signedCookies, so you need to change the log in order to see them

#### Login Route

- check if email and password exists, if one is missing, throw bad request error
- create const user and findOne with the email matching
- if there is no user, throw unauthenticated error
- create isPasswordCorrect that await for comparePassword and pass the password as an parameter
- if it isn't, throw unauthenticated error
- create tokenUser equal to register one
- attachCookiesToResponse
- send back response

#### Logout Route

- send back response cookie with "token", "logout", httpOnly:true and expires instantly
- send back response warning that the user logged out

#### User Routes - Structure

- create userController file
- export getAllUsers, getSingleUser, showCurrentUser, updateUser and updateUserPassword functions
- res.send("any value")
- setup userRoutes file
- setup just one route - router.route("/").get(getAllUsers) - showCurrentUser : /showMe and getSingleUser : /:id
- export
- import in app.js
- use and pass /api/v1/users as path
- setup user routes in postman and test if everything's working fine

#### getAllUsers

- require User from models
- require StatusCodes from http-status-codes
- require CustomError from errors
- create const users and find the users with role equal to user and desselect password by .select("-password")
- send back response

#### getSingleUser

- create const user that findOne with \_id equal to id from params and desselect password by .select("-passoword")
- if there is no user, throw not found error
- send back response

#### authenticateUser - setup

- create authentication.js file in the middleware folder
- require CustomError from errors
- require isTokenValid from utils
- create async const authenticateUser that receives as parameters req, res and next
- create const token equal to token inside the signedCookies
- if there is no token, log the error, otherwise log that the token is present
- invoke next
- exports
- require authenticateUser in userRoutes
- place it in getSingleUser and getAllUsers

#### authenticateUser - complete

- remove the if else condition, and replace it where, if there is no token, throw unauthenticated error
- remove the next()
- create a trycatch block
- already catch a error throwing unauthenticated error
- inside the try block, create const payload and invoke isTokenValid and pass the token
- you can log the payload and test in postman
- remove the log and set the req.user equal to {name, userId, role} and change the const payload to an object with the same values, since you can destructure it or access the values through payload.value
- invoke next
- you can log req.user in the first line of getAllUsers to see if everything's working fine

#### Authorize Permissions - setup

- create unauthorized.js in errors folder
- copy and paste unauthenticatedError
- change the name to unauthorizedErrors and statusCodes to forbidden
- exports
- import and exports in index.js
- in authentication.js
- create const authorizePermission that receives req, res and next as arguments
- check if user role is different than admin, if it is, throw unauthorized error
- invoke next
- exports
- imports in userRoutes and place it in get all users
- test in postman

#### Authorize Permissions - complete

- in userRoutes, pass "admin" and "owner" as arguments in authorizePermission
- remove everything in authorizePermissions, since the admin and owner will be invoked instantly when the application starts, so you dont get req, req and next when express hits the route
- in autorizePermissions, receive roles as and parameter with rest operator
- return req, res and next that check if roles doesn't includes req.user.role, if so, throw unauthorized error, if includes, pass the next()

#### ShowCurrentUser controller

- add authenticaUser in showMe routes
- in the show current user, send back req.user as response

#### UpdatePassword controller

- add authenticateUser in UpdatePassword routes
- get oldPassword and newPassword from req.body
- if one is missing, throw bad request error
- get user trough findOne and pass the \_id equal to userId
- create isPasswordCorret and comparePassword with old Password
- if it doesn't match, throw unauthenticated error
- set user password equal to newPassword
- save user
- send back response with msg notifying the success (optional)

#### CreateTokenUser function

- create createTokenUser file in utils
- create a function that takes user as parameter
- return name: user.name, userId:user.\_id, role:user.role
- exports
- imports and exports in index
- import in authController
- refactor code from register and login

#### UpdateUserController - FindOneAndUpdate()

- add authenticateUser in updateUser routes
- check for name and email in the body
- if one is missing, send back bad request error
- use findOneAndUpdate - (filterQuery, update, options) - \_id: userId, email and name, new:true and runValidators:true
- import createTokenUser in userController
- invoke createTokenUser, pass the user, and set it equal to tokenUser
- attachCookiesToResponse - res, user:tokenUser
- send back response

#### UpdateUserController - user.save()

- add authenticateUser in updateUser routes
- check for name and email in the body
- if one is missing, send back bad request error
- use findOne \_id:userId
- user.email = email
- user.name = name
- save user
- import createTokenUser in userController
- invoke createTokenUser, pass the user, and set it equal to tokenUser
- attachCookiesToResponse - res, user:tokenUser
- send back response
  // when you invoke save, you hash the password, messing around the original value, so...
- if(!this.isModified("password")) return; // only hash the password if the property changed is the password
  // you can check if a path is modified - console.log(this.modifiedPaths())
  // you can check if a property is modified - console.log(this.isModified("name"))

#### CheckPermissions Function

- create checkPermissions.js in utils
- require CustomError from errors
- create const checkPermissions that receives requestUser and resourceUserId as arguments
- exports
- imports and exports in index.js
- in the function, check if requestUser role is equal to admin, if it is, return
- check if requestUser id is equal to resourceUserId.toString(), if it is/ return // ObjectId => string
- if these conditions aren't satisfied, throw unauthorized error
- in getSingleUser, before the response, invoke checkPermissions and pass the req.user and user.\_id

#### Product Model

- create Product.js in models folder
- create Schema
- name: type:string
- price: type:number, default 0
- description: type:string
- image: type:string, default: "/uploads/example.jpeg"
- category: type:string, enum:{values:["office","kitchen","bedroom"],message:"{VALUE} is not supported"}
- company: type:string, enum:{values:["ikea","liddy","marcos"],message:"{VALUE} is not supported"}
- colors: type:[string], default:["#222"] // the brackets indicates that the property will be an array
- featured: type:boolean, default false, no required
- freeshipping: type:boolean, default false, no required
- inventory: type:number, default 15
- averageRating: type:number, default 0, no required
- user: type: mongoose.Types.ObjectId, ref:"User"
- timestamps: true
- exports

#### Product Routes - Structure

- create productController file in controllers
- export createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct, uploadImage
- res.send("function name")
- setup productRoutes file in routes
- import all controllers
- import authenticateUser and authorizePermissions
- only getAllProducts and getSingleProduct accessible to public
- rest only by admin (setup middlewares
- router "/" - post createProduct, admin only - get getAllProducts
- router "/uploadImage" - post uploadImage admin only
- router "/:id" - get singleProduct - patch updateProduct admin only - delete deleteProduct admin only
- exports
- import productRoutes as productRouter in app.js
- setup app use "/api/v1/products", productRouter
- test everything in postman

#### Create Product

- require Product model
- require StatusCodes
- require CustomError
- set body.user equal to user.userId
- set product equal to create() and pass req.body
- send back response
- test is postman

#### Get All Products

- use find({})
- send back response, and number of products

#### Get Single Product

- get id from params
- findOne() matching the id from params and the \_id from products
- if there is no product, throw no product with id
- send back response

#### Update Product

- get const id from req params
- use findOneAndUpdate(), (filterQuery, update, options) \_id: productId, req.body, new and runValidators
- if there is no product, throw no product with id
- send back response

#### Delete Product

- get id from params
- findOne() matching the id from params and the \_id from products
- if there is no product, throw no product with id
- send back response
- invoke product remove
- send back response

#### Upload Image

- require fileUpload from express-fileupload
- app.use(express.static("./public))
- app.use(fileUpload())
- add some random image to the path found in product model and test it in localhost
- to send image in postman, body > form-data > key:file, value: image
- in uploadImage controller, check if there is no req.files, throw bad request error
- create const productImage equal to req.files.image
- if(!productImage.mimetype.startsWith("image")), throw bad request error
- create const maxSize 1024 \* 1024
- if productImage size is bigger than maxSize, throw bad request error, 1mb
- require path
- const imagePath = path.join(\_\_dirname,"../public/uploads/ + `${productImage.name}`)
- await productImage.mv(imagePath)
- send back response image:`/uploads/${productImage.name}`

#### Review model

- create review.js in models folder
- create schema
- rating: type number min 1 max 5
- title: type string
- comment: type string maxlength 100
- ref User mongoose.Schema
- ref Product mongoose.Schema
- timestamps true
- ReviewSchema.index({product:1,user:1},{unique:true}) // user can send only one review per product

#### Review routes structure

- create reviewController
- export createReview, getAllReviews, getSingleReview, updateReview, deleteReview
- res.send("function name")
- setup reviewRoutes in routes
- import authenticateUser from authentication
- import all controllers
- only getAllReviews and getSingleReview accessible to public
- rest only to users (setup middlewares)
- import reviewRoutes as reviewRouter in the app.js
- setup app.use wth "/api/v1/reviews"
- test routes in postman

#### Create review controller

- require review and product model
- require StatusCodes
- require Custom Error
- require createTokenUser, attachCookiesToResponse and checkPermissions
- get product from req.body and set attach it to productId
- check isValidProduct with Product.findOne() \_id equal to productId
- if it isn't valid, throw not found error
- create const alreadySubmitted Review.findOne() and pass product equal to productId and user equal to req.user.userId in the same object
- if already submitted, throw bad request error
- set req.body.user equal to req.user.userId
- create review through create() and pass the req.body
- send back response
- test in postman - product, rating, title and comment

#### Get All Reviews

- create reviews and pass find({})
- send back response with count

#### Get Single Review

- get id from params and rename it to reviewId
- create review const findOne and pass the \_id equal to reviewId
- if there is no review, throw not found error
- send back response

#### Delete review

- get id from params and rename it to reviewId
- create review const findOne and pass the \_id equal to reviewId
- if there is no review, throw not found error
- invoke checkPermissions and pass req.user and review.user
- invoke review remove
- send back response

#### Update review

- get id from params and rename it to reviewId
- get rating, title and comment from req.body
- create review const findOne and pass the \_id equal to reviewId
- if there is no review, throw not found error
- invoke checkPermissions and pass req.user and review.user
- update review.rating, title and comment to the current ones
- save review
- send back response

#### Populate method

- in getAllReviews
- after in Review.find() set .populate({path:"product", select:"name company price"})
- create another populate for user and select name

#### Mongoose virtuals

// properties that doesn't exists in database, only logically

- on product model, after the timestamps but still in the same object, add toJSON:{virtuals:true}, toObject:{virtuals:true}, allowing the model to accept the virtuals
- in getSingleProduct, populate "reviews"
- after Schema set:
  ProductSchema.virtual("reviews",{
  ref:"Review",
  localField:"\_id", // some connection between the two
  foreignField:"product", // field in review model
  justOne:false // because we want a list
  // match: {rating : 5} // only get the reviews with 5 rating
  })

#### Alternative single product reviews // able to query the data

- review controller
- create const getSingleProductReviews
- get id from req.params
- use review.find and pass product equal to id from req.params
- send back response
- exports getSingleProductReviews
- import in productRoutes
- setup route "/:id/reviews" get, public, getSingleProductReviews

#### Remove all reviews // when you remove a product, the reviews are removed too

- productModels
  Product.Schema.pre("remove", async function (){
  await this.model("Review").deleteMany({product:this.\_id})
  })

#### Aggregate Pipeline // setup averageRating and set numberOfReviews automatically

- product model
- below averageRating, add numOfReviews
- review model, add:
  // static methods apply to the entire model on which they are defined whereas instance methods apply only to a specific document within the collection
- ReviewSchema.statics.calculateAverageRating = async function (productId){
  log(productId)
  }
  // pre("save") doesn't hold the actual document that currently exists in the database, it is the document that will be saved, containing the changes done to the document, post("save") holds the real document that is stored in database
- ReviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.product)
  })
- you can use the postman to see the logs and test if everything's working fine
- Reset Database !!! - create product and send two reviews with different ratings

#### Aggreagate pipeline - atlas

- go to mongodb atlas / reviews / aggregation
- select -> $match
- remove query
- add:
- "product":ObjectId("") // pass productId
- add stage, select -> $group
_id:null, // or "$product", doesn't is necessary in this case because the values aren't changing
  averageRating:{$avg:"$rating"},
  numOfReviews:{$sum:1}
- export pipeline, include both // optional
- copy pipeline, create temp.js in models and paste pipeline // optional

#### Aggreagate pipeline - review model

- change the log in calculateAverageRating to:
  const result = await this.aggregate([
  { $match: {product: productId} },
  {
  $group: {
  _id: null,
  averageRating: { $avg: "$rating" },
  numOfReviews:{ $sum: 1 }
  }
  }
  ])
  try {
  await this.model("Product").findOneAndUpdate(
  { \_id: productId },
  {
  averageRating: Math.ceil(result[0]?.averageRating || 0),
  numOfReviews: result[0]?.numOfReviews || 0,
  }
  )
  } catch (error){
  log(error)
  }

#### Order Schema

- create Order.js in models
- create Schema
- tax: type number
- shippingFee: type number
- subtotal: type number
- total: type number
- orderItems: []
- status: type string, enum (pending, failed, paid, delivered, canceled), default pending
- user Schema
- clientSecret: type string
- paymentIntentId: type string not required
- set timestamps
- exports
- before OrderSchema create SingleOrderItemSchema
- name: type string
- image: type string
- price: type number
- amount: type number
- product Schema
- pass the SingleOrderItemSchema inside the OrderItems array

#### Order Structure

- add orderController file in controllers
- export getAllOrders, getSingleOrder, getCurrentUserOrders, createOrder, updateOrder
- res.send("function name")
- setup orderRoutes file in routes
- import authenticateUser and authorizePermissions
- import all controllers
- authenticate user in all routes
- getAllOrders admin only
- router "/showAllMyOrders" getCurrentUserOrders
- exports
- imports in app.js
- app.use "/api/v1/orders", orderRouter
- test everything in postman

#### Create order - check product

- require Order and Product model
- require StatusCodes
- require CustomError
- require checkPermissions
- get items(give it an alias of cartItems), tax and shippingFee from req.body
- if cartItems is missing or it's length is smaller than 1, throw bad request error
- if tax or shipping fee is missing, throw bad request error
- let orderItems = []
- let subtotal = 0
  // for of loop, since we have an async operation inside the loop, and we cannot use await inside a forEach or map
- create for const item of cartItems loop
- inside create dbProduct that await for Product.findOne where \_id match item.product
- if there is no dbProduct, throw not found error
- get name, price, image and \_id from dbProduct
- create const singleOrderItem and pass amount equal to item.amount, name, price, image and product equal to \_id
  // add item to order
  set orderItems equal to rest orderItems and singleOrderItems
  // calculate subtotal
  subtotal += item.amount \* price // you can log orderItems and subtotal to see if everything's working fine

#### Create order - complete

- after the for of loop
- calculate total equal to tax + shippingFee + subtotal
  // get client secret
- const paymentIntent = await fakeStripeAPI({
  amount:total,
  currency:"usd"
  })
- at the start of the controller, create:
  const fakeStripeAPI = async({amount, currency}) => {
  const client_secret = "someRandomValue";
  return {client_secret, amount}
  }
- after paymentIntent
- create const order with create() and pass orderItems, total, subtotal, tax, shippingFee, clientSecret equal to paymentIntent.client_secret and user equal to req.user.userId
- send back response with json {order, clientSecret:order.clientSecret}
- test in postman

#### get all orders

- find({})
  -send back response with count

#### get single order

- get id from req.params
- findOne with \_id matching id from params
- if there is no order, throw not found error
- invoke check permissions and pass the req.user and order.user
- send back response

#### get current user orders

- find orders where user is equal to req.user.userId

#### update order

- get id from req.params
- get paymentIntentId from req.body
- find one with \_id equal to id from params
- if there is no order, throw not found error
- invoke check permissions and pass the req.user and order.user
- set order.paymentIntentId equal to paymentIntentId and order.status equal to "paid"
- save order
- send back response
