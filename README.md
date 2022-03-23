<h1>Running Events</h1>
<h2>https://running-events.herokuapp.com/</h2>
<p>This is a mockup website (although completely functional) of a company that promotes and helps to organize running events, providing a web solution for event organizers. The website allows athletes to register and enroll for running, maintaining a persistent database with the users' information, which events they enrolled, if they confirmed payment and also their classifications and other statistics. Administrators can register new events and update the data concerning the athletes' performance in each race.

This platform is a RESTful WebApp implemented with the SpringBoot framework. The server-side layer makes use of Java for the business logic and the database was built with PostgreSQL and Java Persistence Architecture (JPA). The front-end consists in HTML, CSS and Javascript (jQuery library is widely used for requests to the server). Twilio Sendgrid API is used to send emails to the users, currently just to verify their accounts. This WebApp was developed by Lucas Werle Melz (https://lucasmelz.github.io/portfolio).</p>

<h2>How to deploy the WebApp</h2>
<p>The first thing to do to deploy the application is to create a PostgreSQL database and reference its credentials in the <i>application.yml</i> file, located in the following path: <i>runningEventsPublic/src/main/resources/</i>. After that, for the emailing system to work, it is necessary to create an account in Twilio Sendgrid (https://sendgrid.com), creating a Sender, selecting their Web API method for sending emails and finally generating an API key. That APIkey should be referenced at the <i>EmailService.java</i> file, located at the following path: <i>runningEventsPublic/src/main/java/com/example/Running/Events/email/EmailService.java</i>, line 52. After that, the WebApp is ready to be deployed! If you want to do it on your own machine, acess the source folder of the WebApp through the terminal and run the following commands (make sure you have Maven installed):<br>
  <code>mvn clean</code><br>
  <code>mvn compile</code><br>
  <code>mvn spring-boot:run</code><br>
</p>

<h2>Tips for beginners</h2>
<p>If you found this project interested to learn through it, and if you are feeling kind of lost, maybe the following tips will help you. To learn about how to create a RESTful WebApp using the SpringBoot framework, with a complete backend for user login and registration, and also learning about how to create a PostgreSQL database, I strongly suggest the following tutorial:<br>
https://www.youtube.com/watch?v=QwQuro7ekvc <br>
If you have doubts about how to integrate the Sendgrid Emailing System to the WebApp, it's all throughly explained in the following link:<br>
https://medium.com/javarevisited/sending-emails-with-sendgrid-and-spring-boot-81e9637a1f05
</p>
