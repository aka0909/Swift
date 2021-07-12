
# SWIFT

## About the App
   True to its name, **SWIFT** couples great rapidity with ease of movement. It is your one stop destination for speedy and easy video call and chat connects.
   
   This web application is my submission for the month long challenge to build a video-calling app in **Engage'21, a mentorship program conducted by Microsoft.**
   
## Video Demo
   
## How to run this project locally
- Clone the given repository into your device
- Run the command `npm install` in your terminal in the root directory of the project to install the various dependencies
- Now run `npm i -g peer` to globally install PeerJS
- Install nodemon as a dev dependency by running `npm install --save-dev nodemon` in your terminal
- Now run `nodemon server.js` in the terminal
- Open another terminal and start the peer server by running `peerjs --port 3001`in the terminal
- For the mail feature, in the following codes in server.js file:


  `var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: process.env.EMAIL_ID,
          pass: process.env.PASSWORD
      }
  });`
  
  
  and
  
  
  ` const mailOptions = {
      from: process.env.EMAIL_ID, // sender address
      to: receiver, // list of receivers
      subject: 'Meet mail', // Subject line
      html: output// plain text body
  };`
  
  
  replace "user" and "from" with a gmail id of your choice and pass to the password of the gmail id entered. Make this gmail id available to less secure apps while testing the app.
- The app is now up and running on port 3000!
   
## App Features
   - The uuid library generates unique URLs for every room
   - Real-time chatting feature
   - Chat and talk and enter as many video meets as you wish in the same room
   - Collaborative Whiteboard!!!
   - **ICEBREAKER**: Break the ice with news headlines on a button click!
   - A notes taker
   - Heath alerts that remind you to drink water, stretch a bit or close your eyes after every half an hour
   - Record and download meets
   - Share Screen (only the host can)
   - Light and Dark mode, but we all know you are going for dark :p
   - Basic functionalities of mute,unmute,switch video on or off, end whole meet
   - Invite by sharing the room link or send a mail invite just as easily!
   - Responsive and easy to the eyes UI
## Layout of the application
![6c2b811c548f4305bb7e03d9707efb88-0001](https://user-images.githubusercontent.com/65956313/125353987-e14a6400-e380-11eb-814a-2e30cc51a612.jpg)


## Technologies and Resources used
   - Front end languages: HTML,CSS,Javascript,Axios
   - Front-end framework: Bootstrap to design the user interface (UI)
   - Templating language: EJS
   - Backend: Node.js, Express.js
   - uuid Library: To generate a unique URL for each room
   - NewsAPI: To get top news headlines on the click of a button and break the ice. Awkward silences are a real problem.Period.
   - PeerJS: An intuitive library that acts as a wrapper over WebRTC and makes it easy to establish peer to peer connection.
   - Socket.io: To facilitate communication among users in the same room in real-time!
   - Nodemailer: To facilitate sending mail invite from the app itself on submitting a form
   - Fontawesome: For all the icons in the web app
   - Freepik: For all the images in the web app
   - Codepen: Reference for the waves in the home page, the clock in the join or create room page, theme mode toggler in the rooms
   
## How I used Agile Methodology in the making of this app:
   I had planned my goals in sprints where each sprint was one week long.
   - **Sprint 0:** The main focus was to :
     - Get familiar with the technologies and programming languages required for the project especially since this was my first brush with development. 
     - Develop a rudimentary idea of what features I wanted to include in the application
   - **Sprint 1:** The goal was to make a minimum viable product along with very basic but important features such as mute/unmute, switch video on/off, leave room, copy room          link to clipboard and start working on a chat feature
   - **Sprint 2:** On acheiving most targets in the previous sprint I went on to integrate all of them in a good UI, add a dark and light mode feature, and started thinking and        implementing more complex features in the app
   - **Sprint 3:** Built in more complex features into the app such as share screen, record and download video, collaborative whiteboard and icebreaker and further improved the        UI
   - **Sprint 4:** Added a simple notes taker feature and attempted to incorporate the Adopt feature. Added the health alerts feature into the app, after a talk with my parents and from personal experience on how one loses track of important things while sitting in front of screen for long such as, drinking water or getting up and stretching a bit which are small but very important things for health in the long run.  
   - I used to log my work in the sheet below Sprint-wise. At the starting of each week we had a group mentor call and one-one sessions as well which served as sprint meets and      I used to incorporate the suggestions of my mentors in my work.
     https://docs.google.com/spreadsheets/d/1QoKGWlqi-IsqC-wLYgVI5jm2G5WYAGnrwI3aXgPOc1Q/edit?usp=sharing


