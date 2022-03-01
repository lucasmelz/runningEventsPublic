$(function () { // Same as document.addEventListener("DOMContentLoaded"...
     document.getElementById('homeButton').addEventListener("click",function () {
          displayPageOfEvents("/api/v1/getEventsPageable", 0);
          displayAndHide('home');
     });
     document.getElementById('homeSmallButton').addEventListener("click", function () {
          displayPageOfEvents("/api/v1/getEventsPageable", 0);
          displayAndHide('home');
     });
     document.getElementById('classificationsButton').addEventListener("click", function () {
          displayAndHide('classifications');
     });
     document.getElementById('aboutButton').addEventListener("click", function () {
          displayAndHide('about');
     });
     document.getElementById('aboutSmallButton').addEventListener("click", function () {
          displayAndHide('about');
     });
     document.getElementById('signInButton').addEventListener("click", function () {
          displayAndHide('signIn');
     });
     document.getElementById('signUpButton').addEventListener("click", function () {
          displayAndHide('signUp');
     });
     document.getElementById('adminButton').addEventListener("click", function () {
          displayAndHide('signIn');
     });
     document.getElementById('searchIcon').addEventListener("click", function(){
          searchEvent();
     });

     /* $.get("/api/v1/isAuthenticated", "", function (data) {
      //if user is authenticated, redirect to authenticated user homepage
        if (data && (page === 'index.html' || page === '')) {
                     window.location.replace("/homepage.html");
        }
      });*/
     displayPageOfEvents("/api/v1/getEventsPageable", 0);
})

function displayAndHide(section){
     const menuItems = ['home', 'classifications', 'about', 'signIn', 'signUp'];
     for(let i = 0; i<menuItems.length; i++){
          document.getElementById(menuItems[i]).style.display = "none";
     }
     document.getElementById(section).style.display = "inherit";
}

function displayPageOfEvents(url, pageNumber){

     $.get(url, {pageNumber: pageNumber, pageSize:4}, function () {})
         .done(function (data){

              //cleaning section which contains a message in case no event is found
              document.querySelector('#notFoundAnyEvents').innerHTML = "";

              //setting up pagination mechanism
              let paginationMechanism = document.getElementById("paginationMechanism");
              paginationMechanism.innerHTML = "";
              let pages = pagination(data['number'], data['totalPages']);
              let previousPageButton = document.createElement("button");
              previousPageButton.innerText = "<<";
              previousPageButton.setAttribute("class", "pageButton");
              if(data['number']===0){
                   previousPageButton.setAttribute("onclick", `displayPageOfEvents(\"${url}\",0)`);
              }
              else{
                   previousPageButton.setAttribute("onclick", `displayPageOfEvents(\"${url}\",${data['number']-1})`);
              }
              paginationMechanism.appendChild(previousPageButton);

              for(let i = 0; i<pages.length; i++){
                   let pageButton = document.createElement("button");
                   pageButton.setAttribute("class", "pageButton");
                   if(data['number']===i){
                        pageButton.className += ' active';
                   }
                   if(pages[i]==="..."){
                        pageButton.setAttribute("onclick", `displayPageOfEvents(\"${url}\",${i-1})`);
                   }
                   else{
                        pageButton.setAttribute("onclick", `displayPageOfEvents(\"${url}\",${i})`);
                   }
                   pageButton.innerText = pages[i].toString();
                   paginationMechanism.appendChild(pageButton);
              }

              let nextPageButton = document.createElement("button");
              nextPageButton.innerText = ">>";
              nextPageButton.setAttribute("class", "pageButton");
              if(data['number'] === (data['totalPages']-1)){
                   nextPageButton.setAttribute("onclick", `displayPageOfEvents(\"${url}\",${data['totalPages']-1})`);
              }
              else{
                   nextPageButton.setAttribute("onclick", `displayPageOfEvents(\"${url}\",${data['number']+1})`);
              }
              paginationMechanism.appendChild(nextPageButton);

              //dynamically inserting event cards into the page
              let eventsContainer = document.getElementById('eventsContainer');
              eventsContainer.innerHTML="";
              if(!data['totalElements']){ //data['totalElements'] will be 0 if there are no events registered
                   let thereAreNoEventsMessage = document.createElement("h3");
                   thereAreNoEventsMessage.innerText = "Not found any events.";
                   document.querySelector('#notFoundAnyEvents').appendChild(thereAreNoEventsMessage);
              }
              else{
                   let events = data['content'];
                   for(let i = 0; i<data['numberOfElements']; i++){
                        let eventDiv = document.createElement("div");
                        eventDiv.setAttribute("class", "events");
                        eventDiv.setAttribute("id", "event" + events[i]['id']);
                        //Setting event title
                        let eventTitle = document.createElement("h3");
                        eventTitle.innerText = events[i]['name'];
                        eventDiv.appendChild(eventTitle);
                        //Setting event picture
                        let imageWrapper = document.createElement("div");
                        imageWrapper.setAttribute("class", "imageWrapper");
                        let img = document.createElement("img");
                        img.setAttribute("class", "eventPic");
                        if(!events[i]['picture']){
                             //if the event has no descriptive picture, a standard picture will be used
                             img.setAttribute("src", "images/sport.png");
                             imageWrapper.appendChild(img);
                        }
                        else{
                             img.src = events[i]['picture'];
                             imageWrapper.innerHTML = img.outerHTML;
                        }
                        eventDiv.appendChild(imageWrapper);

                        //Setting event info
                        let eventInfo = document.createElement("div");
                        eventInfo.setAttribute("class", "eventInfo");

                        let description = document.createElement("p");
                        description.innerText = events[i]['description'];
                        eventInfo.appendChild(description);

                        let eventDate = document.createElement("p");
                        eventDate.innerText = "Date: " + new Date(events[i]['date']).toDateString();
                        eventInfo.appendChild(eventDate);

                        let enrollmentPrice = document.createElement("p");
                        enrollmentPrice.innerText = "Enrollment price: " + events[i]['enrollmentPrice'] + "€";
                        eventInfo.appendChild(enrollmentPrice);

                        eventDiv.appendChild(eventInfo);

                        //Setting up buttons
                        let firstButton = document.createElement("button");
                        let secondButton = document.createElement("button");
                        firstButton.setAttribute("class", "seeCompetitors");
                        firstButton.setAttribute("onclick", `seeCompetitors(${events[i]['id']})`);
                        firstButton.innerText = "See all the competitors!";

                        switch(events[i]['eventStatus']){
                             case "PAST": //classifications are only available for past events
                                  secondButton.setAttribute("class", "seeClassifications");
                                  secondButton.setAttribute("onclick",`seeClassifications(${events[i]['id']})`);
                                  secondButton.innerText = "See the classifications!";
                                  eventDiv.appendChild(firstButton);
                                  eventDiv.appendChild(secondButton);
                                  break;
                             default: //for current or present events, the "Enroll" button is available
                                  secondButton.setAttribute("class", "enrollButton");
                                  secondButton.setAttribute("onclick",`enroll(${events[i]['id']})`);
                                  secondButton.innerText = "Enroll!";
                                  eventDiv.appendChild(firstButton);
                                  eventDiv.appendChild(secondButton);
                                  break;
                        }
                        //appending the 'event card' to the events container
                        eventsContainer.appendChild(eventDiv);
                   }
              }
         })
}

function searchEvent() {
     let textInput = document.getElementById("searchTextBox").value;
     displayPageOfEvents(`/api/v1/searchEvent?searchInput=${textInput}`, 0);
}

function enroll(eventId){
     console.log(eventId);
}

function seeClassifications(eventId){
     console.log(eventId);
}

function seeCompetitors(eventId){
     console.log(eventId);
}

function getRange(start, end) {
     return Array(end - start + 1).fill().map((v,i) => i + start);
}

function pagination(current, length, delta = 3) {
     const range = {
          start: Math.round(current - delta / 2),
          end: Math.round(current + delta / 2)
     };

     if(range.start - 1 === 1 || range.end + 1 === length) {
          range.start += 1;
          range.end += 1;
     }

     let pages = current > delta ? getRange(
         Math.min(range.start, length - delta),
         Math.min(range.end, length)
     ) : getRange(1, Math.min(length, delta + 1));

     const withDots = (value, pair) => pages.length + 1 !== length? pair : [value];

     if (pages[0] !== 1) {
          pages = withDots(1, [1, '...']).concat(pages);
     }

     if (pages[pages.length - 1] < length) {
          pages = pages.concat(withDots(length, ['...', length]));
     }

     return pages;
}

