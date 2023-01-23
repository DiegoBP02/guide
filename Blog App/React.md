#### Installing

- npx create-react-app
- add the following font in index.html
<link
    href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@100;200;300;400;500;600;700&family=Lora:ital@0;1&family=Varela&family=Varela+Round&display=swap"
    rel="stylesheet" />
- also add fontawesome
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
   integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
   crossorigin="anonymous" />
- below the font, add style with \* { margin: 0}
- change the title
- remove link reel to favicon
- delete everything except index.html
- src, leave just app and index.js
- clean both
- start the application and check if everything works

#### Navbar

- src, create topbar folder with topbar.css and TopBar.jsx
- topbar html:
- topbar css:

#### Header

- src, create header folder with header.css and Header.jsx
- create pages folder, inside it create home folder, inside home create Home.jsx and home.css
- create div with home className and place Header inside it, after the header will be the homepage
- place Home after TopBar in App.js
- Header html:
- header css:

#### Sidebar

- src, create sidebar folder with sidebar.css and Sidebar.jsx
- src, create posts folder with posts.css and Posts.jsx
- setup basic return
- Home.jsx, React fragment, Header, .home with Posts and Sidebar

#### Blog post component

- src, create post Folder with post.css and Post.jsx
- setup basic return
- in Posts,jsx, place 6 Post component

#### Single post component

- create components folder and move every component to it
- fix imports
- pages, create single folder with single.css and Single.jsx
- setup basic return
- in App.js, change Home to Single for now
- components, create singlePost folder with SinglePost.jsx and singlePost.css
- in Single.jsx, return SinglePost and Sidebar component
- setup basic return

#### Create a new post component

- create write folder with write.css and Write.jsx
- setup basic return
- in App.js, change Single to Write for now

#### User setting components

#### Login and Register pages

#### React router dom
