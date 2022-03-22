
        var events_Were_Initialized = false;
        var events = JSON.parse('{}');
        var pastEvents = [];
        var menuItems = ['searchEvent', 'searchResults', 'eventsList', 'classifications', 'about', 'signIn', 'signUp', 'listOfCompetitors'];
        var menuItemsAthletePage = ['searchEvent', 'searchResults', 'eventsList', 'classifications', 'about', 'myEnrollments', 'listOfCompetitors'];
        var page = window.location.pathname.split("/").pop();

        $(document).ready(function() {
            displayEvents();
            $.get("/api/v1/isAuthenticated", "", function (data) {
                //if user is authenticated, redirect to authenticated user homepage
                if (data && (page === 'index.html' || page === '')) {
                    window.location.replace("/homepage.html");
                }
            });
        })

        function displayAndHide(section){
            let itemsMenu = [];
            switch(page){
                case 'index.html':
                case '': itemsMenu = menuItems;
                break;
                case 'homepage.html': itemsMenu = menuItemsAthletePage;
                break;
            }

           if(section==='eventsList' || section==='searchResults'){
               itemsMenu = itemsMenu.filter(e => e!=='searchEvent' && e!== section);
               for(let i = 0; i<itemsMenu.length; i++){
                   document.getElementById(itemsMenu[i]).style.display = "none";
               }
               document.getElementById('searchEvent').style.display = "inherit";
               document.getElementById(section).style.display = "inherit";
               itemsMenu.push('searchEvent', section);
           }
           else{
               itemsMenu = itemsMenu.filter(e => e!== section);
               for(let i = 0; i<itemsMenu.length; i++){
                   document.getElementById(itemsMenu[i]).style.display = "none";
               }
               document.getElementById(section).style.display = "inherit";
               itemsMenu.push(section);
           }
        }

        function displayClassifications(){
            initializeClassifications();
            displayAndHide('classifications');
        }

        function displayAbout(){
            displayAndHide('about');
        }

        function displaySignIn(){
            displayAndHide('signIn');
        }

        function displaySignUp(){
            displayAndHide('signUp');
        }


        function displayMyEnrollments(){
            initializeMyEnrollments();
            displayAndHide('myEnrollments');
        }

        function displayEvents() {
            if (!events_Were_Initialized) {
                initializeEvents();
            }
            displayAndHide('eventsList');
        }

        function initializeEvents() {

            events_Were_Initialized = true;

            $.get("/api/v1/getEvents", "", function (data) {

                let string = JSON.stringify(data);
                events = JSON.parse(string);

                if (events.length === 0) {
                    let noEventsRegistered = document.createElement("h2");
                    noEventsRegistered.innerText = "There aren't events registered in our database.";
                    document.getElementById('eventsList').appendChild(noEventsRegistered);
                } else {
                    events = events.sort(function (a, b) {
                        let aDate = new Date(a.year, a.month, a.day, a.hour, a.min);
                        let bDate = new Date(b.year, b.month, b.day, b.hour, b.min);
                        return aDate - bDate;
                    });

                    let currentDate = new Date();
                    let currentAndFutureEvents = [];

                    for (let i = 0; i < events.length; i++) {
                        let eventDate = new Date(events[i].year, events[i].month - 1, events[i].day);
                        if (eventDate < currentDate) {
                            pastEvents.push(events[i]);
                        } else {
                            currentAndFutureEvents.push(events[i]);
                        }
                    }

                    //list of events, listing first current and future events and at last past events
                    //for classifications, list only past events
                    for (let i = 0; i < currentAndFutureEvents.length; i++) {
                        let event = document.createElement("div");
                        event = newEvent(currentAndFutureEvents[i]);
                        event.setAttribute("id", `event${currentAndFutureEvents[i].id}`);
                        let listOfCompetitorsButton = createSeeCompetitorsButton(currentAndFutureEvents[i].id);
                        event.appendChild(listOfCompetitorsButton);
                        event.appendChild(document.createElement("br"));
                        let enrollmentButton = createEnrollmentButton(currentAndFutureEvents[i].id, 0);
                        event.appendChild(enrollmentButton);
                        document.getElementById('eventsList').appendChild(event);
                    }
                    for (let i = 0; i < pastEvents.length; i++) {
                        let event = document.createElement("div");
                        event = newEvent(pastEvents[i]);
                        event.setAttribute("id", `event${pastEvents[i].id}`);
                        let listOfCompetitorsButton = createSeeCompetitorsButton(pastEvents[i].id);
                        event.appendChild(listOfCompetitorsButton);
                        document.getElementById('eventsList').appendChild(event);
                    }
                }
            })
        }

        function createEnrollmentButton (eventId, listOrSearchResults){
            let id = (listOrSearchResults===0) ? eventId : "s" + eventId;
            let enrollmentButton = document.createElement("button");
            enrollmentButton.setAttribute("onclick", `enroll(${eventId}, ${listOrSearchResults})`);
            enrollmentButton.setAttribute("id", `enrollmentButton${id}`)
            enrollmentButton.innerText = "Enroll!";
            return enrollmentButton;
        }

        function createSeeCompetitorsButton (eventId){
            let listOfCompetitorsButton = document.createElement("button");
            listOfCompetitorsButton.innerHTML = "See the list of competitors.";
            listOfCompetitorsButton.setAttribute("class", `competitorsButton${eventId}`);
            listOfCompetitorsButton.setAttribute("onclick", `seeCompetitors(${eventId})`);
            return listOfCompetitorsButton;
        }

        function enroll(event_Id, listOrSearchResults){
            $.get("/api/v1/isAuthenticated", "", function (data) {
                if(data){//if user is authenticated
                createEnrollmentConfirmation(event_Id, listOrSearchResults);
                }
                else{
                    alert("You must sign in to enroll!");
                }
            })
        }

        function seeCompetitors(eventId){

            let listOfCompetitors = document.getElementById("listOfCompetitors");
            listOfCompetitors.innerHTML = "";
            let allCompetitors = [];

            $.get("/api/v1/getEvents", "", function (data) {
            }).done(function(data){

                let string = JSON.stringify(data);

                //again I can't access the properties of the JSON object corresponding to the array of events
                //so I'll manipulate the string to find the relevant information

                let positionId = string.search("id\":" + `${eventId}`);
                let substring = string.slice(positionId);
                positionId = substring.search("name");
                substring = substring.slice(positionId+7);
                positionId = substring.search('\"');
                let title = substring.slice(0, positionId);
                displayAndHide("listOfCompetitors");
                let titleOfEvent = document.createElement("h2");
                titleOfEvent.innerText = title;
                listOfCompetitors.appendChild(titleOfEvent);

                $.ajax({
                    type: "POST",
                    url: "/api/v1/getEnrollmentsByEventId",
                    data: `${eventId}`,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }).done(function(data) {
                    let enrollments = data;

                    for (let i = 0; i < enrollments.length; i++) {

                        let c = {
                            name: enrollments[i]['name'],
                            gender: enrollments[i]['gender'],
                            competitiveCategory: enrollments[i]['competitiveCategory'],
                            paid: enrollments[i]['paid']
                        };
                        allCompetitors.push(c);
                    }

                    let labels = ['name', 'gender', 'competitiveCategory', 'paid'];

                      for(let i = 0; i<allCompetitors.length; i++){

                        let c = allCompetitors[i];
                        let p = document.createElement("p");
                        let paid = "";
                        if (c.paid === true) {
                            paid = "paid."
                        } else {
                            paid = "not paid."
                        }
                        p.innerText = `Name: ${c.name}. Gender: ${c.gender}. 
                        Competitive Category: ${c.competitiveCategory}. Status: ${paid}`;
                        listOfCompetitors.appendChild(p);
                    }

                })

            })
        }

        function createEnrollmentConfirmation(event_Id, listOrSearchResults){

            let id = (listOrSearchResults===0) ? event_Id : "s" + event_Id;

            document.getElementById(`enrollmentButton${id}`).remove();

            $.get("/api/v1/username", "", function (data) {
                let user = data;
                $.get("/api/v1/getAppUserByUsername", {username: user}, function (d) {
                    //createForm
                    let enrollmentDetails = document.createElement("p");
                    enrollmentDetails.setAttribute("id", `enrollmentDetails${id}`);
                    enrollmentDetails.innerHTML = `<b>Enrollment details</b><br>
                    Name: ${d.firstName}<br>
                    Last name: ${d.lastName}<br>
                    Gender: ${d.gender}<br>
                    Email: ${d.email}<br>
                    Competitive Category: ${d.competitiveCategory}<br>`;
                    let confirmEnrollment = document.createElement("button");
                    let cancelEnrollment = document.createElement("button");
                    confirmEnrollment.textContent = "Confirm enrollment.";
                    cancelEnrollment.textContent = "Cancel enrollment.";
                    confirmEnrollment.setAttribute("class", "enrollmentButton");
                    confirmEnrollment.setAttribute("id", `confirmEnrollment${id}`);
                    confirmEnrollment.setAttribute("onclick", `confirmEnrollment(${event_Id}, ${listOrSearchResults})`);
                    cancelEnrollment.setAttribute("class", "enrollmentButton");
                    cancelEnrollment.setAttribute("id", `cancelEnrollment${id}`);
                    cancelEnrollment.setAttribute("onclick", `cancelEnrollment(${event_Id}, ${listOrSearchResults})`);
                    let event = document.getElementById(`event${id}`);
                    event.appendChild(enrollmentDetails);
                    event.appendChild(confirmEnrollment);
                    event.appendChild(cancelEnrollment);
                })
            })
        }

        function cancelEnrollment(event_Id, listOrSearchResults){
            let id = (listOrSearchResults===0) ? event_Id : "s" + event_Id;
            document.getElementById(`enrollmentDetails${id}`).remove();
            document.getElementById(`confirmEnrollment${id}`).remove();
            document.getElementById(`cancelEnrollment${id}`).remove();
            let enrollmentButton = createEnrollmentButton(event_Id, listOrSearchResults);
            document.getElementById(`event${id}`).appendChild(enrollmentButton);
        }

        function confirmEnrollment(event_id, listOrSearchResults){
            let id_ = (listOrSearchResults===0) ? event_id : "s" + event_id;
            document.getElementById(`enrollmentDetails${id_}`).remove();
            document.getElementById(`confirmEnrollment${id_}`).remove();
            document.getElementById(`cancelEnrollment${id_}`).remove();

            $.get("/api/v1/getEvents", "", function (eventsData) {

             /*   for some reason I can't access the property enrollment price
                from the global variable events, which is an array
                with all events, so I'm making the get request again,
                converting all events to a string and manipulating the string
                to find the enrollment price...*/

                let allEvents = JSON.stringify(eventsData);
                let positionId = allEvents.search("id\":" + `${event_id}`);
                let substring = allEvents.slice(positionId);
                positionId = substring.search("enrollmentPrice");
                substring = substring.slice(positionId+17);
                positionId = substring.search("}");
                let price = substring.slice(0, positionId);
                let id = parseInt(event_id);

                $.get("/api/v1/username", "", function (data) { //get username of authenticated user
                    let user = data;
                    $.ajax({
                        type: "POST",
                        url: "/api/v1/isUserEnrolled", //find out if user is enrolled in this event
                        data: JSON.stringify({
                            eventId: id,
                            username: user
                        }),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }).done(function(data){

                        if(data){//if user is already enrolled in this event
                            alert("User already enrolled in this event!");
                        }
                        else{//if user is not enrolled in this event
                            $.post("http://alunos.di.uevora.pt/tweb/t2/mbref4payment", {amount: price}, function(d){

                                let enrollmentConfirmation = document.createElement("p");
                                let payment_reference = d.mb_reference;
                                let paymentEntity = d.mb_entity;
                                enrollmentConfirmation.innerHTML = "<b>Your enrollment will be confirmed after the payment.</b><br>" +
                                    "<b>Payment entity: </b>" + paymentEntity + "<br>" +
                                    "<b>Payment reference: </b>" + payment_reference;
                                document.getElementById(`event${id_}`).appendChild(enrollmentConfirmation);

                                let ref = parseInt(payment_reference);

                                $.get("/api/v1/getAppUserByUsername", {username: user}, function(d) {} //get user details for enrollment
                                ).done(function(data){

                                    $.ajax({
                                        type: "POST",
                                        url: "/api/v1/enrollEventUser",
                                        data: JSON.stringify({
                                            eventId: id,
                                            username: user,
                                            paymentReference: ref,
                                            name: data['firstName'] + " " + data['lastName'],
                                            gender: data['gender'],
                                            competitiveCategory: data['competitiveCategory']
                                        }),
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json'
                                        }
                                    });


                                })

                            })
                        }
                    });
                })
            })
        }


        function newEvent(event){
            let newEvent = document.createElement("div");
            let title = document.createElement("h3");
            let description = document.createElement("p");
            let eventDate = document.createElement("p");
            let time = document.createElement("p");
            let price = document.createElement("p");
            let day = event['day'];
            let month = event['month'];
            let year = event['year'];
            let hour = event['hour'];
            let min = event['min'];

            title.innerHTML = event['name'];
            description.innerHTML = event['description'];
            eventDate.innerHTML = "Date: " + day + "-" + month + "-" + year + ".";
            time.innerHTML = "Event schedule: starts at " + hour + ":" + min + ".";
            price.innerHTML = "Price of enrollment: " + event['enrollmentPrice'] + "€.";

            newEvent.appendChild(title);
            newEvent.appendChild(description);
            newEvent.appendChild(eventDate);
            newEvent.appendChild(time);
            newEvent.appendChild(price);
            return newEvent;
        }

        function analyzeDateInput(txt){
            
            let day = '';
            let month = '';
            let year = '';
            let numbers = 0;
            
            for(let i=0; i<txt.length; i++){
                let c = txt.charAt(i)
                
                if (c >= '0' && c <= '9') {numbers++;}
                
                if(c==='/' || c==='-'){
                    if(numbers===2){
                        day = txt.substring(i-2,i);
                        month = txt.substring(i+1,i+3);
                        year = txt.substring(i+4,i+8);
                        numbers=-99;
                    }
                    
                    if(numbers===4){
                        year = txt.substring(i-4,i);
                        month = txt.substring(i+1,i+3);
                        day =txt.substring(i+4,i+6);
                    }                            
                }
            }
            return {day: day, month: month, year:year};
        }

        
       function searchSpecificEvent(){

            let eventsAlreadyAdded = [];

            let e = document.getElementById("searchResults");
           displayAndHide('searchResults');
           e.innerHTML="";

            let txt = document.getElementById('eventInput').value;
            let date = {day:'', month:'', year:''};
            let isThereAnEvent = false;

            if(txt.includes('-') || txt.includes('/')){
                date = analyzeDateInput(txt);
                let day = date.day;
                let month = date.month;
                for(let i = 0; i<events.length;i++){
                    let d = events[i]['day'];
                    let m = events[i]['month'];
                    if(day==d && month==m && !eventsAlreadyAdded.includes(i)){
                        eventsAlreadyAdded.push(i);
                        isThereAnEvent=true;
                        let event = document.createElement("div");
                        event = newEvent(events[i]);
                        event.setAttribute("id", "events" + events[i].id)
                        let currentDate = new Date();
                        let eventDate = new Date(events[i].year, events[i].month-1, events[i].day);
                        if(eventDate<currentDate) {
                            //past
                            //set competitors button
                            let listOfCompetitorsButton = createSeeCompetitorsButton(events[i].id);
                            event.appendChild(listOfCompetitorsButton);
                        }
                        else{ //current or future event, set competitors and enrollment button
                            let listOfCompetitorsButton = createSeeCompetitorsButton(events[i].id);
                            event.appendChild(listOfCompetitorsButton);
                            event.appendChild(document.createElement("br"));
                            let enrollmentButton = createEnrollmentButton(events[i].id, 1);
                            event.appendChild(enrollmentButton);
                        }
                        document.getElementById('searchResults').appendChild(event);
                    }
                }
                
            }
            else {
                let word = txt.toLowerCase();

                let inputWithoutPunctuation = word.replace(/[^\w\s]|_/g, "")
                    .replace(/\s+/g, " ");
                let inputExactlyTheSameAsEventName = false;

                for (let i = 0; i < events.length; i++) {
                    let eventName = events[i]['name'].replace(/[^\w\s]|_/g, "")
                        .replace(/\s+/g, " ").toLowerCase();
                    if (eventName === inputWithoutPunctuation) {
                        isThereAnEvent = true;
                        inputExactlyTheSameAsEventName = true;
                        let event = document.createElement("div");
                        event = newEvent(events[i]);
                        event.setAttribute("id", "events" + events[i].id);
                        let currentDate = new Date();
                        let eventDate = new Date(events[i].year, events[i].month - 1, events[i].day);
                        if (eventDate < currentDate) {
                            //past
                            //set competitors button
                            let listOfCompetitorsButton = createSeeCompetitorsButton(events[i].id);
                            event.appendChild(listOfCompetitorsButton);
                        } else { //current or future event, set competitors and enrollment button
                            let listOfCompetitorsButton = createSeeCompetitorsButton(events[i].id);
                            event.appendChild(listOfCompetitorsButton);
                            event.appendChild(document.createElement("br"));
                            let enrollmentButton = createEnrollmentButton(events[i].id, 1);
                            event.appendChild(enrollmentButton);
                        }
                        document.getElementById('searchResults').appendChild(event);
                    }
                }

                if (!inputExactlyTheSameAsEventName) {

                    let words = word.split(" ");

                    for (let i = 0; i < events.length; i++) {
                        for (let j = 0; j < words.length; j++) {
                            if (events[i]['name'].toLowerCase().includes(words[j]) && !eventsAlreadyAdded.includes(i)) {
                                eventsAlreadyAdded.push(i);
                                isThereAnEvent = true;
                                let event = document.createElement("div");
                                event = newEvent(events[i]);
                                event.setAttribute("id", "events" + events[i].id);
                                let currentDate = new Date();
                                let eventDate = new Date(events[i].year, events[i].month - 1, events[i].day);
                                if (eventDate < currentDate) {
                                    //past
                                    //set competitors button
                                    let listOfCompetitorsButton = createSeeCompetitorsButton(events[i].id);
                                    event.appendChild(listOfCompetitorsButton);
                                } else { //current or future event, set competitors and enrollment button
                                    let listOfCompetitorsButton = createSeeCompetitorsButton(events[i].id);
                                    event.appendChild(listOfCompetitorsButton);
                                    event.appendChild(document.createElement("br"));
                                    let enrollmentButton = createEnrollmentButton(events[i].id, 1);
                                    event.appendChild(enrollmentButton);
                                }
                                document.getElementById('searchResults').appendChild(event);
                            }
                        }
                    }
                }

                if (isThereAnEvent === false) {
                    const alert = document.createElement("h3");
                    alert.innerHTML = 'There are no events with this name or date.';
                    document.getElementById('searchResults').appendChild(alert);
                }
            }
        }


        function registerUser(){
            let formData = new FormData(document.getElementById('registrationForm'));
            let object = {};
            formData.forEach((value, key) => {
                // Reflect.has in favor of: object.hasOwnProperty(key)
                if(!Reflect.has(object, key)){
                    object[key] = value;
                    return;
                }
                if(!Array.isArray(object[key])){
                    object[key] = [object[key]];
                }
                object[key].push(value);
            });
            let jsonObject = JSON.stringify(object);

            fetch('/api/v1/registration', {
                method: "POST",
                body: jsonObject,
                headers: {"Content-type": "application/json; charset=UTF-8"}
            })
                .then(response => response.json())
                .then(json => console.log(json))
        .catch(err => console.log(err));

        }

        function initializeMyEnrollments() {

            let arrayOfEnrollments = [];

            $.get("/api/v1/username", "", function (data) { //get username of authenticated user
                let user = data;
                $.get("/api/v1/getEnrollmentsByUsername", {username: user}, function (d) {
                }).done(function (data) {

                    arrayOfEnrollments = data;
                    let enrollmentsList = document.getElementById('listOfEnrollments');
                    enrollmentsList.innerHTML = '';

                    if(arrayOfEnrollments.length===0){
                        let noEnrollmentsRegistered = document.createElement("h3");
                        noEnrollmentsRegistered.innerText = "You haven't enrolled any event yet!"
                        enrollmentsList.appendChild(noEnrollmentsRegistered);
                    }
                    else {

                        let eventIdsArray = []
                        let pastEvents = [];
                        let currentAndFutureEvents = [];
                        let now = new Date();


                        for (let i = 0; i < arrayOfEnrollments.length; i++) {
                            eventIdsArray.push(arrayOfEnrollments[i].eventId);
                        }


                        for (let i = 0; i < events.length; i++) {
                            if (eventIdsArray.includes(events[i].id)) {
                                if (now < new Date(events[i].year, events[i].month - 1, events[i].day)) {
                                    currentAndFutureEvents.push(events[i]);
                                } else {
                                    pastEvents.push(events[i]);
                                }
                            }
                        }

                        for (let i = 0; i < currentAndFutureEvents.length; i++) {
                            for (let k = 0; k < arrayOfEnrollments.length; k++) {
                                if (currentAndFutureEvents[i].id === arrayOfEnrollments[k].eventId) { //add enrollment to list
                                    let div = document.createElement("div");
                                    let h = document.createElement("h4");
                                    h.innerText = currentAndFutureEvents[i].name;
                                    let p = document.createElement("p");
                                    p.innerHTML = `Date: ${currentAndFutureEvents[i].day}/${currentAndFutureEvents[i].month}
                            /${currentAndFutureEvents[i].year}<br>Hour: ${currentAndFutureEvents[i].hour}:${currentAndFutureEvents[i].min}<br>
                            Price of enrollment: ${currentAndFutureEvents[i].enrollmentPrice}€<br>
                            Payment reference: ${arrayOfEnrollments[k].paymentReference}<br>
                            Competitive category: ${arrayOfEnrollments[k].competitiveCategory} / ${arrayOfEnrollments[k].gender}`;
                                    div.appendChild(h);
                                    div.appendChild(p);
                                    enrollmentsList.appendChild(div);
                                }
                            }
                        }

                        for (let i = pastEvents.length - 1; i >= 0; i--) {
                            for (let k = 0; k < arrayOfEnrollments.length; k++) {
                                if (pastEvents[i].id === arrayOfEnrollments[k].eventId) { //add enrollment to list
                                    let div = document.createElement("div");
                                    let h = document.createElement("h4");
                                    h.innerText = pastEvents[i].name;
                                    let p = document.createElement("p");
                                    p.innerHTML = `Date: ${pastEvents[i].day}/${pastEvents[i].month}
                            /${pastEvents[i].year}<br>Hour: ${pastEvents[i].hour}:${pastEvents[i].min}<br>
                            Price of enrollment: ${pastEvents[i].enrollmentPrice}€<br>
                            Payment reference: ${arrayOfEnrollments[k].paymentReference}<br>
                            Competitive category: ${arrayOfEnrollments[k].competitiveCategory} / ${arrayOfEnrollments[k].gender}`;
                                    div.appendChild(h);
                                    div.appendChild(p);
                                    enrollmentsList.appendChild(div);
                                }
                            }
                        }
                    }

                })
            })
        }

        function initializeClassifications(){

            let classificationsDiv = document.getElementById("classifications");
            classificationsDiv.innerHTML = "";


            let eventSelector = document.createElement("select");
            eventSelector.setAttribute("id", "classificationsEventSelector");
            for(let i = 0; i<pastEvents.length; i++){
                let option = document.createElement("option");
                option.text = pastEvents[i]['name'];
                option.value = pastEvents[i]['id'];
                eventSelector.appendChild(option);
            }

            let competitiveCategorySelector = document.createElement("select");
            competitiveCategorySelector.setAttribute("id", "classificationsCategorySelector");
            let categories = ["Youth: 18 to 19 years old", "Senior: 20 to 34 years old",
                "Veteran 35: 35 to 39 years old", "Veteran 40: 40 to 49 years old",
                "Veteran 50: 50 to 59 years old", "Veteran 60+: 60 years old or more", "General"];
            for (let i = 0; i<categories.length; i++){
                let option = document.createElement("option");
                option.text = categories[i];
                option.value = (i).toString();
                competitiveCategorySelector.appendChild(option);
            }
            let genderSelector = document.createElement("select");
            genderSelector.setAttribute("id", "classificationsGenderSelector");
            let genders = ['Male', 'Female', 'General'];
            for(let i = 0; i<genders.length; i++){
                let option = document.createElement("option");
                option.text = genders[i];
                option.value = (i).toString();
                genderSelector.appendChild(option);
            }

            let stages = ['P1', 'P2', 'P3', 'Finish'];
            let stageSelector = document.createElement("select");
            stageSelector.setAttribute("id", "classificationsStageSelector");

            for (let i = 0; i<stages.length; i++){
                let option = document.createElement("option");
                option.text = stages[i];
                option.value = stages[i].toLowerCase();
                stageSelector.appendChild(option);
            }


            let button = document.createElement("button");
            button.innerText = "See classifications";
            button.setAttribute("onclick", "calculateClassifications()");

            let header = document.createElement("h2");
            header.innerText = "Classifications";

            let classificationsOutput = document.createElement("div");
            classificationsOutput.setAttribute("id", "classificationsOutput");

            let p = document.createElement("p");
            p.innerText = "Select event, competitive category, gender and the stage of the running.";

            classificationsDiv.appendChild(header);
            classificationsDiv.appendChild(p);
            classificationsDiv.appendChild(document.createElement("br"));
            classificationsDiv.appendChild(eventSelector);
            classificationsDiv.appendChild(document.createElement("br"));
            classificationsDiv.appendChild(competitiveCategorySelector);
            classificationsDiv.appendChild(document.createElement("br"));
            classificationsDiv.appendChild(genderSelector);
            classificationsDiv.appendChild(document.createElement("br"));
            classificationsDiv.appendChild(stageSelector);
            classificationsDiv.appendChild(document.createElement("br"));
            classificationsDiv.appendChild(button);
            classificationsDiv.appendChild(document.createElement("br"));
            classificationsDiv.appendChild(classificationsOutput);

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
                                let startDate = new Date(competitors[i]['start']);
                                let p1Date = new Date(competitors[i]['p1']);
                                competitors[i]['finalTime'] = Math.abs(p1Date - startDate);
                            }

                            break;


                        case "p2":

                            for(let i = 0; i<competitors.length; i++){
                                let startDate = new Date(competitors[i]['start']);
                                let p2Date = new Date(competitors[i]['p2']);
                                competitors[i]['finalTime'] = Math.abs(p2Date - startDate);
                            }
                            break;


                        case "p3":
                            for(let i = 0; i<competitors.length; i++){
                                let startDate = new Date(competitors[i]['start']);
                                let p3Date = new Date(competitors[i]['p3']);
                                competitors[i]['finalTime'] = Math.abs(p3Date - startDate);
                            }

                            break;

                        case "finish":

                            for(let i = 0; i<competitors.length; i++){
                                let startDate = new Date(competitors[i]['start']);
                                let finishDate = new Date(competitors[i]['finish']);
                                competitors[i]['finalTime'] = Math.abs(finishDate - startDate);
                            }

                            break;
                    }

                    competitors.sort(function (a, b) {
                        return a.finalTime - b.finalTime;
                    });


                    for(let i = 0; i<competitors.length; i++){

                        let hours = competitors[i]['finalTime']/3600000;
                        let minutes = 0;
                        let seconds = 0;
                        let milliseconds = 0;
                        if(hours>1){
                            hours = hours - (hours%1);
                            competitors[i]['finalTime']-= hours*3600000;
                        }
                        else hours = 0;
                        minutes = competitors[i]['finalTime']/60000;
                        if(minutes>1){
                            minutes = minutes - (minutes%1);
                            competitors[i]['finalTime']-= minutes*60000;
                        }
                        else minutes = 0;
                        seconds = competitors[i]['finalTime']/1000;
                        if(seconds>1){
                            seconds = seconds - (seconds%1);
                            competitors[i]['finalTime']-= seconds*1000;
                        }
                        else seconds = 0;
                        milliseconds =  competitors[i]['finalTime'];

                        let p = document.createElement("p");
                        $.get("/api/v1/getEnrollmentsByUsername",
                            {username: competitors[i]['username']},function(data){

                                p.innerText = `${i+1}º lugar: ${data[0]['name']}. 
                    Tempo: ${hours} hours; ${minutes} min; ${seconds} sec; ${milliseconds} ms.`;

                            })
                        output.appendChild(p);


                    }


                }



            })


        }
