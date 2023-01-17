This is a guide I made throughout the project to redo it later

#### Update user model

- add following three properties
- verificationToken - String
- isVerified - {type:Boolean, default:false}
- verified - Date

#### Update Register Controller

- remove everything after User.create()
- setup fake verificationToken - "fake token" before the User.create()
- add the verification token to the User.create() only while testing in postman
- send back success message and token

#### Update login controller

- after isPasswordCorrect check if user.isVerified is true, if isn't tehn throw unauthenticated error

#### Proper verification token

- require crypto package and attach it to a const
- take off the previous string in the verificationToken and pass crypto.randomBytes(40).toString("hex"), this transform the buffer in string, and change it from utf-8 to hex

#### Verify email controller

- create verifyEmail controller
- get verificationToken and email from req.body
- send back response passing both things back
- export verifyEmail
- import verifyEmail in the routes
- setup verifyEmail router as a post route with path("/verify-email") and pass the verifyEmail
- test if everything work in the postman
- create const user that awaits for user.findOne and pass the email
- if there is no user, throw unauthenticated error
- check if user.verificationToken is equal to verificationToken, if isn't then throw unauthenticatedError
- if it is equal, then set user.isVerified equal to true, user.verified equal to Date.now() and user.verification token equal to a empty string
- save the user with instance method
- send back message saying that the email is verified

#### Send email - Setup

- install package nodemailer
- create account in ethereal
- create (nodemailerConfig, sendEmail, sendResetPassword, sendVerificationEmail) files in the utils

### sendEmail.js

- in the sendEmail, require nodemailer package
- create async sendEmail
- pass the following code with the proper values
  let testAccount = await nodemailer.createTestAccount()
  const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
  user: 'giovanna.schulist@ethereal.email',
  pass: 'dT3U7nQMpjs6GAGWPh'
  }
  });
  let info = await transporter.sendMail({
  from: '"Fred Foo 👻" <foo@example.com>', // sender address
  to: "bar@example.com, baz@example.com", // list of receivers
  subject: "Hello ✔", // Subject line
  text: "Hello world?", // plain text body
  html: "<b>Hello world?</b>", // html body
  });
- exports sendEmail
- require sendEmail in the authController
- remove the token from the response in the user controller
- after the User.create(), await sendEmail and invoke it
- test in postman

#### Send verification link

- take off the object that are being passed in the transporter inside the sendEmail.js, and exports it in the nodemailerConfig.js
- import nodemailerConfig and pass it in the transporter const
- create a object as an parameter with to, subject and html in the sendEmail const
- remove the properties after the from in the let info and pass to, subject and html instead
- you can change the let info = await to return, since this is a async function and is returning a promise regardless

### sendVerificationEmail.js

- require sendEmail
- create async const sendVerificationEmail and pass name,email,verificationToken and origin as parameters inside a object
- create const message and pass create an html paragraph saying "Please confirm your email by clicking on the following link:"
- at the end of the function, return sendEmail with the following arguments: to and pass the email, subject informing the email confirmation and html saying hello, ${name} inside a h4 and pass the message after the h4, remember that all of this must be inside a template string
- exports sendVerificationEmail
- import sendVerificationEmail and exports it in the index.js
- import sendVerificationEmail in the authController and remove sendEmail

### SendEmail pt2

- in the authController, instead of await sendEmail, change it to sendVerificationEmail
- below or above the user.create(), create origin const that holds the current URL where the application is running, while development it probably will be http://localhost:3000
- pass the values from user.create() inside the sendVerificationEmail except the role and the password, also passes the origin
- inside sendVerificationEmail.js create verifyEmail const and setup a url with `${origin}/user/verify-email?token=${verificationToken}&email=${email}`
- inside the const message, complete it by adding an "a" html element that href to verifyEmail and pass verify email as the content

#### Token model

- create Token moldel file in models folder
- create Schema TokenSchema
- inside the TokenSchema create the following properties:
  refreshToken:type:String, required:true
  ip:type:String, required:true
  userAgent:type:String, required:true
  isValid:type:Boolean, default:true
  user:type:mongoose.Types.ObjectId,ref:"User",required:true
- set timestamps equal to true
- export schema

#### Create token in login controller

- for the time being, comment out attachCookiesToResponse
- create refreshToken with let and set the value equal to a empty string
- set the refreshToken = crypto.randomBytes(40).toString("hex")
- create const userAgent = req.headers["user-agent"]
- create const ip = req.ip
- create const userToken and pass refreshToken, ip, userAgent and user(\_id) inside a object
- require Token from models
- await for Token.create() and pass the userToken
- you can attach token.create() into a token const and pass it in the response for testing purposes

#### Send multiple cookies

- delete const token, but the await part remains
- uncomment attachCookiesToResponse
- remove token from response
- pass the refreshToken into the attachCookiesToResponse
- copy and paste attachCookiesToResponse in the jwt.js and change the name to attachSingleCookieToResponseand comment it just for your reference
- remove the expiration from createJWT
- pass the refreshToken to attachCookiesToResponse parameter
- change the name of the token const to accessTokenJWT and pass the payload as a user object
- copy and paste accessTokenJWT, change the name to refreshTokenJWT and pass the refreshToken as well
- in the response, change the name to accessToken, and pass the accessTokenJWT instead of the token
- remove expires for the time being
- add maxAge property and pass the time value in ms
- copy and paste the response and change the values to refreshToken and refreshTokenJWT
- the expires property will be equal to one day

#### Check for existing token

- in the authController, after the refreshToken, create existingToken const that awaits for Token.findOne and pass the user equal to user.\_id
- check if existingToken is true, if it is, take the isValid property from existingToken, and check if isValid doesn't exists, then throw unauthenticated error, if it exists, then set refreshToken equal to the refreshToken from the existingToken
- at the end of the check, set attachCookiesToResponse and response equal to the ones at the end of the function, lastly, return

#### Refactor auth middleware - AccessToken

- create user folder in postman
- create or copy and paste from e-commerce project the Show Current User
- remove the object from isTokenValid parameter in the jwt.js
- in the authentication.js, remove everything from authenticateUser minus the trycatch block and the catch error
- get the refreshToken and the accessToken from req.signedCookies
- inside the try block, if accessToken exists, create a const named payload that is equal to isTokenValid and pass the accessToken as an argument
  set the req.user as the payload.user
- return next()
- test in postman (login and show current user), it should not work since acessToken expires in 1 second
- passes 15min in the accessToken
- test (login and show current user), you should get the response by now

#### Refactor auth middleware - RefreshToken

- after the if condition, create const payload equal isTokenValid and pass refreshToken as an argument
- create const existingToken that awaits for Token.findOne() and pass the user equal to payload.user.userId and refreshToken equal to payload.refreshToken
- check if there is no existing token or if isValid isn't true (check with chain operator(?.)), if both are false, then throw unauthenticated error
- import attachCookiesToResponse from utils
- invoke attachCookiesToResponse and pass a object with res, user: payload.user and refreshToken: existingToken.refreshToken
- set req.user = equal to payload.user
- pass the next()
- test in postman, if you get back both cookies in show current works, then everything works fine

#### Fix logout functionality

- import authenticateUser in the authRoutes
- change logout route to delete instead of get
- set authenticateUser before the logout
- in the logout function, await for Token.findOneAndDelete() and pass the user equal to req.user.userId
- make sure that there is 2 res.cookie, one for accessToken and one for refreshToken and set the expires equal to Date.now()
- test it, create delete path in the postman (method and path)

#### Set proper time in attachCookiesToResponse

- create const longerExp equal to 30 days
- remove MaxAge from accessToken and pass expires with one day expiration
- in the refreshToken pass the longerExp in the expires

#### Forgot/Reset password - structure

- user model
- passwordToken {type:String}
- passwordTokenExpirationDate {type:Date}
- authController
- forgotPassword and resetPassword
- authRoutes
- post "/forgot-password and "reset-password

#### Forgot password controller

- get email from req.body
- if there is no email, throw bad request error
- get the user through user.findOne() and pass the email
- if user exists, create const passwordToken that is equal to crypto.randomBytes(70).toString("hex")
- create const tenMinutes and pass ten minutes in ms
- create const passwordTokenExpirationDate that is equal to the current time plus tenMinutes (new Date(Date.now()))
- set user.passwordToken equal to passwordToken and do the same to passwordTokenExpirationDate
- await user.save()
- send back response ok and msg for checking email for reset password link

#### Send reset password email

- update the values in the nodemailerConfig.js
- in the utils, import and export sendResetPasswordEmail
- import sendResetPassword email in the authController
- in the forgotPassword function, after the passwordToken const, create origin const equal to the current url (normally "http://localhost:3000")
- await sendResetPasswordEmail and pass the following arguments:
- name and email can be found in the user
- token equal to passwordToken
- origin
- require sendEmail in the sendResetPasswordEmail
- create async const sendResetPasswordEmail that receives name, email, token and origin as parameters
- create const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`;
- create const message = `<p>Please confirm your email by clicking on the following link : <a href="${resetURL}">Verify Email</a> </p>`;
- return sendEmail with the following parameters:
  to:email
  subject: "Reset password"
  html: `(h4)Hello, ${name}(/h4) ${message}`
- exports

#### Reset password controller

- get token, email and password from req.body
- if any of them is missing, throw bad request error
- set user const igual to findOne and pass the email
- if user exists, then create const currentDate equal to new Date()
- if user.passwordToken is equal to token and user.passwordTokenExpirationDate is bigger than currentDate, then set user.password = password and user.passwordToken and user.passwordTokenExpirationDate equal to null
- await user.save()

#### Hash password token

- create createHash.js in utils
- require crypto libray
- create const hashString = (string) => crypto.createHash("md5").update(string).digest("hex")
- exports
- import and exports in utils, rename it to createHash
- import createHash in the authController
- invoke it at the end of forgotPassword controller, where user.passwordToken is being updated and in the comparation inside the if condition in the resetPassword
