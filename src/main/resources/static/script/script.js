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


function setClassificationsOptions(){

     let options = document.getElementById("classificationsOptions");
     options.innerHTML = "";
     document.getElementById('classificationsOutput').innerHTML = "";

     $.get("/api/v1/getEvents", "", function (){}).done(function (data) {

          let events = JSON.parse(JSON.stringify(data));
          events = events.sort(sortBy("name"));

          let eventSelector = document.createElement("select");
          eventSelector.setAttribute("id", "classificationsEventSelector");

          let disabledOption = document.createElement("option");
          disabledOption.text = "";
          disabledOption.setAttribute("disabled", "disabled");
          disabledOption.setAttribute("selected", "selected");
          eventSelector.appendChild(disabledOption);

          for(let i = 0; i<events.length; i++){
               let option = document.createElement("option");
               option.text = events[i]['name'];
               option.value = events[i]['id'];
               eventSelector.appendChild(option);
          }

          let competitiveCategorySelector = document.createElement("select");
          competitiveCategorySelector.setAttribute("id", "classificationsCategorySelector");
          let categories = ["Youth: 18 to 19 years old", "Senior: 20 to 34 years old",
               "Veteran 35: 35 to 39 years old", "Veteran 40: 40 to 49 years old",
               "Veteran 50: 50 to 59 years old", "Veteran 60+: 60 years old or more", "General"];
          for (let i = 0; i<categories.length-1; i++){
               let option = document.createElement("option");
               option.text = categories[i];
               option.value = (i).toString();
               competitiveCategorySelector.appendChild(option);
          }
          let generalOption = document.createElement("option");
          generalOption.text = categories[6]; // general category option is selected as default
          generalOption.value = (6).toString(); //               \/ \/ \/ \/ \/
          generalOption.setAttribute("selected", "selected");
          competitiveCategorySelector.appendChild(generalOption);

          let genderSelector = document.createElement("select");
          genderSelector.setAttribute("id", "classificationsGenderSelector");
          let genders = ['Male', 'Female', 'General'];
          for(let i = 0; i<genders.length-1; i++){
               let option = document.createElement("option");
               option.text = genders[i];
               option.value = (i).toString();
               genderSelector.appendChild(option);
          }
          let option = document.createElement("option");
          option.text = genders[2]; //gender option "general" is selected as default option
          option.value = (2).toString(); //               \/ \/ \/ \/ \/
          option.setAttribute("selected", "selected");
          genderSelector.appendChild(option);


          let stages = ['P1', 'P2', 'P3', 'Finish'];
          let stageSelector = document.createElement("select");
          stageSelector.setAttribute("id", "classificationsStageSelector");

          for (let i = 0; i<stages.length-1; i++){
               let option = document.createElement("option");
               option.text = stages[i];
               option.value = stages[i].toLowerCase();
               stageSelector.appendChild(option);
          }

          let finishOption = document.createElement("option");
          finishOption.text = stages[3];  //Finish is selected as default stage option
          finishOption.value = stages[3].toLowerCase(); //   \/ \/ \/ \/ \/ \/ \/
          finishOption.setAttribute("selected", "selected");
          stageSelector.appendChild(finishOption);

          let button = document.createElement("button");
          button.innerText = "See classifications";
          button.addEventListener("click", function (){
               calculateClassifications();
          });

          let p = document.createElement("p");
          p.innerText = "Select event, competitive category, gender and the stage of the running.";

          options.appendChild(p);
          options.appendChild(document.createElement("br"));
          options.appendChild(eventSelector);
          options.appendChild(document.createElement("br"));
          options.appendChild(competitiveCategorySelector);
          options.appendChild(document.createElement("br"));
          options.appendChild(genderSelector);
          options.appendChild(document.createElement("br"));
          options.appendChild(stageSelector);
          options.appendChild(document.createElement("br"));
          options.appendChild(button);
          options.appendChild(document.createElement("br"));
     });
}

function calculateClassifications(){

     let output = document.getElementById("classificationsOutput");
     output.innerHTML = "";
     let eventSelector = document.getElementById('classificationsEventSelector');
     let eventId = eventSelector.options[eventSelector.selectedIndex].value;
     let categorySelector = document.getElementById('classificationsCategorySelector');
     let category = categorySelector.options[categorySelector.selectedIndex].value;
     let genderSelector = document.getElementById('classificationsGenderSelector');
     let gender = genderSelector.options[genderSelector.selectedIndex].value;
     let stageSelector = document.getElementById('classificationsStageSelector');
     let stage = stageSelector.options[stageSelector.selectedIndex].value;

     let categories = ['YOUTH', 'SENIOR', 'VETERAN_35', 'VETERAN_40', 'VETERAN_50', 'VETERAN_60'];
     let genders = ['MALE', 'FEMALE'];


     $.get("/api/v1/getTimeStamps", {eventId: eventId}, function (data) {

          let competitors = [];
          if(data.length) {

               switch(true){
                    case gender==2 && category==6:
                         competitors = data;
                         break;

                    case gender==2:
                         competitors = data.filter( c => c.competitiveCategory===categories[category]);
                         break;

                    case category==6:
                         competitors = data.filter(c => c.gender===genders[gender]);
                         break;

                    default:
                         competitors = data.filter( c => c.competitiveCategory===categories[category] &&
                             c.gender===genders[gender]);
                         break;
               }

               switch(stage){

                    case "p1":
                         for(let i = 0; i<competitors.length; i++){
                              if(competitors[i]['start']===null || competitors[i]['p1']===null){
                                   competitors.splice(i,1);
                                   i--;
                              }
                              else{
                                   let startDate = new Date(competitors[i]['start']);
                                   let p1Date = new Date(competitors[i]['p1']);
                                   competitors[i]['finalTime'] = Math.abs(p1Date - startDate);
                              }
                         }
                         break;

                    case "p2":
                         for(let i = 0; i<competitors.length; i++){
                              if(competitors[i]['start']===null || competitors[i]['p2']===null){
                                   competitors.splice(i,1);
                                   i--;
                              }
                              else{
                                   let startDate = new Date(competitors[i]['start']);
                                   let p2Date = new Date(competitors[i]['p2']);
                                   competitors[i]['finalTime'] = Math.abs(p2Date - startDate);
                              }
                         }
                         break;

                    case "p3":
                         for(let i = 0; i<competitors.length; i++){
                              if(competitors[i]['start']===null || competitors[i]['p3']===null){
                                   competitors.splice(i,1);
                                   i--;
                              }
                              else{
                                   let startDate = new Date(competitors[i]['start']);
                                   let p3Date = new Date(competitors[i]['p3']);
                                   competitors[i]['finalTime'] = Math.abs(p3Date - startDate);
                              }
                         }
                         break;

                    case "finish":
                         for(let i = 0; i<competitors.length; i++){
                              if(competitors[i]['start']===null || competitors[i]['finish']===null){
                                   competitors.splice(i,1);
                                   i--;
                              }
                              else{
                                   let startDate = new Date(competitors[i]['start']);
                                   let finishDate = new Date(competitors[i]['finish']);
                                   competitors[i]['finalTime'] = Math.abs(finishDate - startDate);
                              }
                         }
                         break;
               }

               competitors.sort(function (a, b) {
                    return a.finalTime - b.finalTime;
               });


               for(let i = 0; i<competitors.length; i++){

                    let p = document.createElement("p");

                    $.get("/api/v1/getEnrollmentsByUsername",
                        {username: competitors[i]['username']},function(data) {

                             let competitorName = data[0]['name'];

                             let hours = competitors[i]['finalTime'] / 3600000;
                             let minutes = 0;
                             let seconds = 0;
                             let milliseconds = 0;
                             if (hours >= 1) {
                                  hours = hours - (hours % 1);
                                  competitors[i]['finalTime'] -= hours * 3600000;
                             } else hours = 0;

                             minutes = competitors[i]['finalTime'] / 60000;
                             if (minutes >= 1) {
                                  minutes = minutes - (minutes % 1);
                                  competitors[i]['finalTime'] -= minutes * 60000;
                             } else minutes = 0;

                             seconds = competitors[i]['finalTime'] / 1000;
                             if (seconds >= 1) {
                                  seconds = seconds - (seconds % 1);
                                  competitors[i]['finalTime'] -= seconds * 1000;
                             } else seconds = 0;

                             milliseconds = competitors[i]['finalTime'];

                             p.innerText = `${i + 1}º place: ${competitorName}. 
                    Time: ${hours} hours; ${minutes} min; ${seconds} sec; ${milliseconds} ms.`;

                        })
                    output.appendChild(p);
               }
          }
     })
}


