var events_Were_Initialized = false;
var events = JSON.parse('{}');
var pastEvents = [];
var menuItems = ['classificationsAdmin', 'registerEventSection', 'recordTimeStamps', 'results', 'allEvents'];
var indexesOfSearchResults = [];

$(document).ready(function() {
    initialize_events();
})

function initialize_events(){
    events_Were_Initialized = true;

    $.get("/api/v1/getEvents", "", function (data) {

        let string = JSON.stringify(data);
        events = JSON.parse(string);

        events = events.sort(function (a, b) {
            let aDate = new Date(a.year, a.month, a.day, a.hour, a.min);
            let bDate = new Date(b.year, b.month, b.day, b.hour, b.min);
            return aDate - bDate;
        });

        let now = new Date();

        for(let i = 0; i<events.length; i++){
            let eventDate = new Date(events[i].year, events[i].month - 1, events[i].day);
            if(eventDate>now){
                i = events.length; //exit loop
            }
            else{
                pastEvents.push(events[i]);
            }
        }
        displayClassif();
    })

}


function displayAndHide(section){

    if(section==='recordTimeStamps'){
        menuItems = menuItems.filter(e => e!=='searchEvent' && e!== section);
        for(let i = 0; i<menuItems.length; i++){
            document.getElementById(menuItems[i]).style.display = "none";
        }
        document.getElementById('searchEvent').style.display = "inherit";
        document.getElementById(section).style.display = "inherit";
        menuItems.push('searchEvent', section);
    }
    else{
        menuItems = menuItems.filter(e => e!== section);
        for(let i = 0; i<menuItems.length; i++){
            document.getElementById(menuItems[i]).style.display = "none";
        }
        document.getElementById(section).style.display = "inherit";
        menuItems.push(section);
    }
}

function displayRegisterEvent(){
    displayAndHide('registerEventSection');
    document.getElementById('registerEventOutput').innerHTML ='';
}

function displayClassif(){
    displayAndHide('classificationsAdmin');
    initializeClassifications();
}

function displayRecordTimeStamps(){
    displayAndHide('recordTimeStamps');
    document.getElementById('allEvents').style.display = "inherit";
    listAllEvents();
}

function listAllEvents(){
    let list = document.getElementById('allEvents');
    list.innerHTML = '';
    for(let i = pastEvents.length-1; i>=0; i--){
        let event = document.createElement("div");
        event.setAttribute("class", "recordDiv");
        event.setAttribute("id", `event${i}`)
        let h3 = document.createElement("h3");
        h3.setAttribute("class", "eventTitle");
        h3.setAttribute("onclick", `record(${i}, 0)`);
        h3.innerText = pastEvents[i]['name'];
        event.appendChild(h3);
        let selectorDiv = document.createElement("div");
        selectorDiv.setAttribute("id", `selectorDiv${i}`)
        event.appendChild(selectorDiv);
        list.appendChild(event);
    }
}

function searchSpecificEvent(){
    indexesOfSearchResults = [];
    let list = document.getElementById('allEvents');
    list.innerHTML = '';
    list.style.display = "none";

    let e = document.getElementById("results");
    e.style.display = 'inherit';
    e.innerHTML="";

    let txt = document.getElementById('eventInput').value;
    let date = {day:'', month:'', year:''};
    let isThereAnEvent = false;

    if(txt.includes('-') || txt.includes('/')){
        date = analyzeDateInput(txt);
        let day = date.day;
        let month = date.month;
        for(let i = 0; i<pastEvents.length;i++){
            let d = pastEvents[i]['day'];
            let m = pastEvents[i]['month'];
            if(day==d && month==m && !indexesOfSearchResults.includes(i)){
                indexesOfSearchResults.push(i);
                isThereAnEvent=true;
                let event = document.createElement("div");
                event.setAttribute("class", "recordDiv");
                event.setAttribute("id", `event${i}`)
                let h3 = document.createElement("h3");
                h3.setAttribute("class", "eventTitle");
                h3.setAttribute("onclick", `record(${i},1)`);
                h3.innerText = pastEvents[i]['name'];
                event.appendChild(h3);
                let selectorDiv = document.createElement("div");
                selectorDiv.setAttribute("id", `selectorDiv${i}`)
                event.appendChild(selectorDiv);
                document.getElementById('results').appendChild(event);
            }
        }

    }
    else {
        let word = txt.toLowerCase();

        let inputWithoutPunctuation = word.replace(/[^\w\s]|_/g, "")
            .replace(/\s+/g, " ");

        for (let i = 0; i < pastEvents.length; i++) {
            let eventName = pastEvents[i]['name'].replace(/[^\w\s]|_/g, "")
                .replace(/\s+/g, " ").toLowerCase();
            if (eventName === inputWithoutPunctuation) {
                let event = document.createElement("div");
                event.setAttribute("class", "recordDiv");
                event.setAttribute("id", `event${i}`)
                let h3 = document.createElement("h3");
                h3.setAttribute("class", "eventTitle");
                h3.setAttribute("onclick", `record(${i}, 1)`);
                h3.innerText = pastEvents[i]['name'];
                event.appendChild(h3);
                let selectorDiv = document.createElement("div");
                selectorDiv.setAttribute("id", `selectorDiv${i}`)
                event.appendChild(selectorDiv);
                document.getElementById('results').appendChild(event);
                return;
            }
        }

        let words = word.split(" ");

        for (let i = pastEvents.length-1; i >= 0; i--) {
            for (let j = 0; j < words.length; j++) {
                if (pastEvents[i]['name'].toLowerCase().includes(words[j]) && !indexesOfSearchResults.includes(i)) {
                    indexesOfSearchResults.push(i);
                    isThereAnEvent = true;
                    let event = document.createElement("div");
                    event.setAttribute("class", "recordDiv");
                    event.setAttribute("id", `event${i}`)
                    let h3 = document.createElement("h3");
                    h3.setAttribute("class", "eventTitle");
                    h3.setAttribute("onclick", `record(${i}, 1)`);
                    h3.innerText = pastEvents[i]['name'];
                    event.appendChild(h3);
                    let selectorDiv = document.createElement("div");
                    selectorDiv.setAttribute("id", `selectorDiv${i}`)
                    event.appendChild(selectorDiv);
                    document.getElementById('results').appendChild(event);
                }
            }
        }

    }
        if (isThereAnEvent === false) {
            const alert = document.createElement("h3");
            alert.innerHTML = 'There are no events with this name or date.';
            document.getElementById('results').appendChild(alert);
        }
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

function record(eventIndex, searchOrCompleteList){

    document.getElementById(`selectorDiv${eventIndex}`).innerHTML = "";
    if(searchOrCompleteList===0) {
        for (let i = 0; i < pastEvents.length; i++) {
            if (i !== eventIndex) {
                document.getElementById(`event${i}`).style.display = "none";
            }
        }
    }
    else{
        for(let i = 0; i<indexesOfSearchResults.length;i++){
            if (indexesOfSearchResults[i] !== eventIndex) {
                document.getElementById(`event${indexesOfSearchResults[i]}`).style.display = "none";
            }
        }
    }
    let eventId = pastEvents[eventIndex].id;

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
        let paragraph = document.createElement("p");
        let selectList = document.createElement("select");
        selectList.setAttribute("id", `selector${eventIndex}`);

        enrollments.sort(function(a, b){
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
        })

        for(let i = 0; i<enrollments.length; i++){
            let option = document.createElement("option");
            option.value = enrollments[i]['username'];
            option.text = enrollments[i]['name'];
            selectList.appendChild(option);
        }
        paragraph.innerText = "Select an athlete: ";
        paragraph.setAttribute("class", "selectionParagraph");
        paragraph.appendChild(selectList);
        let button = document.createElement("button");
        button.innerText = "Record timestamps!";
        button.setAttribute("onclick", `setTimestamps(${eventIndex})`);
        button.setAttribute("id", `setButton${eventIndex}`);
        paragraph.appendChild(button);
        document.getElementById(`selectorDiv${eventIndex}`).appendChild(paragraph);
    })
}

function setTimestamps(index){

    document.getElementById(`setButton${index}`).remove();
    let paragraph = document.createElement("p");
    paragraph.innerText = "Select point corresponding to the timestamp ";
    let s = document.createElement("select");
    s.setAttribute("id", `s${index}`);
    let start = document.createElement("option");
    start.text = "Start";
    start.value = "start";
    let p1 = document.createElement("option");
    p1.text = "P1";
    p1.value = "p1";
    let p2 = document.createElement("option");
    p2.text = "P2";
    p2.value = "p2";
    let p3 = document.createElement("option");
    p3.text = "P3";
    p3.value = "p3";
    let finish = document.createElement("option");
    finish.text = "Finish";
    finish.value = "finish";
    s.appendChild(start);
    s.appendChild(p1);
    s.appendChild(p2);
    s.appendChild(p3);
    s.appendChild(finish);
    paragraph.appendChild(s);
    paragraph.setAttribute("class", "selectionParagraph");
    document.getElementById(`selectorDiv${index}`).appendChild(paragraph);

    //these next paragraphs will contain the input boxes for registering the athletes' timestamps

    let paragraph2 = document.createElement("p");

    //day input
    paragraph2.innerText = "Day: ";
    let day = document.createElement("input");
    day.setAttribute("type", "text");
    day.setAttribute("id", `day${index}`);
    day.setAttribute("style", "width:25px;");
    paragraph2.appendChild(day);

    //month input
    let text = document.createTextNode("  Month: ");
    paragraph2.appendChild(text);
    let monthSelector = document.createElement("select");
    monthSelector.setAttribute("id", `month${index}`)
    let monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    for(let i = 0; i<monthNames.length; i++){
        let m = document.createElement("option");
        m.text = monthNames[i];
        m.value = (i+1).toString();
        m.setAttribute("style", "text-align:center;")
        monthSelector.appendChild(m);
    }
    paragraph2.appendChild(monthSelector);

    //year input
    text = document.createTextNode(" Year: ");
    paragraph2.appendChild(text);
    let year = document.createElement("input");
    year.setAttribute("type", "text");
    year.setAttribute("id", `year${index}`);
    year.setAttribute("style", "width:45px;");
    paragraph2.appendChild(year);

    let paragraph3 = document.createElement("p");

    //hour input
    text = document.createTextNode(" Hour: ");
    paragraph3.appendChild(text);
    let hour = document.createElement("input");
    hour.setAttribute("type", "text");
    hour.setAttribute("id", `hour${index}`);
    hour.setAttribute("style", "width:25px;");
    paragraph3.appendChild(hour);

    //minutes input
    text = document.createTextNode(" Minutes: ");
    paragraph3.appendChild(text);
    let min = document.createElement("input");
    min.setAttribute("type", "text");
    min.setAttribute("id", `min${index}`);
    min.setAttribute("style", "width:25px;");
    paragraph3.appendChild(min);

    //seconds input
    text = document.createTextNode(" Seconds: ");
    paragraph3.appendChild(text);
    let seconds = document.createElement("input");
    seconds.setAttribute("type", "text");
    seconds.setAttribute("id", `seconds${index}`);
    seconds.setAttribute("style", "width:25px;");
    paragraph3.appendChild(seconds);

    let paragraph4 = document.createElement("p");

    //milliseconds
    text = document.createTextNode(" Milliseconds: ");
    paragraph4.appendChild(text);
    let milliseconds = document.createElement("input");
    milliseconds.setAttribute("type", "text");
    milliseconds.setAttribute("id", `milliseconds${index}`);
    milliseconds.setAttribute("style", "width:45px;");
    milliseconds.setAttribute("value", "0");
    paragraph4.appendChild(milliseconds);

    paragraph2.setAttribute("style", "font-size:0.8em; text-align:center;");
    paragraph3.setAttribute("style", "font-size:0.8em; text-align:center;");
    paragraph4.setAttribute("style", "font-size:0.8em; text-align:center;");

    document.getElementById(`selectorDiv${index}`).appendChild(paragraph2);
    document.getElementById(`selectorDiv${index}`).appendChild(paragraph3);

    let submitTimestamp = document.createElement("button");
    submitTimestamp.setAttribute("onclick", `submitTimestamp(${index})`);
    submitTimestamp.innerText = "Submit timestamp."
    paragraph4.appendChild(submitTimestamp);

    document.getElementById(`selectorDiv${index}`).appendChild(paragraph4);

}

function submitTimestamp(index){


    let nameSelector = document.getElementById(`selector${index}`);
    let username = nameSelector.options[nameSelector.selectedIndex].value;
    let pointSelector = document.getElementById(`s${index}`);
    let point = pointSelector.options[pointSelector.selectedIndex].value;

    let eventId = pastEvents[index].id;
    let year = document.getElementById(`year${index}`).value;
    let monthSelector = document.getElementById(`month${index}`);
    let month = monthSelector.options[monthSelector.selectedIndex].value;
    let day = document.getElementById(`day${index}`).value;
    let hour = document.getElementById(`hour${index}`).value;
    let min = document.getElementById(`min${index}`).value;
    let seconds = document.getElementById(`seconds${index}`).value;
    let milliseconds = document.getElementById(`milliseconds${index}`).value;

    $.get("/api/v1/admin/doesTimestampExists",
        {username: username, eventId: eventId},
        function (data) {
    }).done(function(data){
        if(data){ //if timestamp exists, record new information

         recordNewTimestamp(point, username, eventId, year, month, day, hour, min, seconds, milliseconds);

        }
        else{ //if timestamp doesn't exist yet, create one and then record new information

            $.get("/api/v1/getEnrollmentsByUsername", {username: username}, function (d) {
            }).done(function (data) {
                let competitiveCategory = data[0]['competitiveCategory'];
                let gender = data[0]['gender'];

                $.ajax({
                    type: "POST",
                    url: "/api/v1/admin/newTimeStamp", //find out if user is enrolled in this event
                    data: JSON.stringify({
                        username: username,
                        eventId: eventId,
                        competitiveCategory: competitiveCategory,
                        gender: gender
                    }),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }).done(function(data){
                    recordNewTimestamp(point, username, eventId, year, month, day, hour, min, seconds, milliseconds);
                })
            })
        }
    })

}

function recordNewTimestamp(point, username, eventId, year, month, day, hour, min, seconds, milliseconds){

    let nanoseconds = milliseconds*1000000;

switch(point){
    case "start":

        $.ajax({
            type: "POST",
            url: "api/v1/admin/setStart",
            data: JSON.stringify({username: username,
                eventId: eventId,
                year: year,
                month:month,
                day: day,
                hour: hour,
                min: min,
                second: seconds,
                nanoOfSecond: nanoseconds
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        break;

    case "p1":

        $.ajax({
            type: "POST",
            url: "api/v1/admin/setP1",
            data: JSON.stringify({username: username,
                eventId: eventId,
                year: year,
                month:month,
                day: day,
                hour: hour,
                min: min,
                second: seconds,
                nanoOfSecond: nanoseconds
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        break;

    case "p2":

        $.ajax({
            type: "POST",
            url: "api/v1/admin/setP2",
            data: JSON.stringify({username: username,
                eventId: eventId,
                year: year,
                month:month,
                day: day,
                hour: hour,
                min: min,
                second: seconds,
                nanoOfSecond: nanoseconds
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        break;

    case "p3":

        $.ajax({
            type: "POST",
            url: "api/v1/admin/setP3",
            data: JSON.stringify({username: username,
                eventId: eventId,
                year: year,
                month:month,
                day: day,
                hour: hour,
                min: min,
                second: seconds,
                nanoOfSecond: nanoseconds
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        break;

    case "finish":

        $.ajax({
            type: "POST",
            url: "api/v1/admin/setFinish",
            data: JSON.stringify({username: username,
                eventId: eventId,
                year: year,
                month:month,
                day: day,
                hour: hour,
                min: min,
                second: seconds,
                nanoOfSecond: nanoseconds
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        break;

}

}

function registerNewEvent(){

    let name = document.getElementById("eventNameForm").value;
    let description = document.getElementById('descriptionForm').value;
    let enrollmentPrice = Number(document.getElementById('enrollmentPriceForm').value);
    let day = Number(document.getElementById('dayForm').value);
    let month = Number(document.getElementById('monthForm').value);
    let year = Number(document.getElementById('yearForm').value);
    let hour = Number(document.getElementById('hourForm').value);
    let min = Number(document.getElementById('minForm').value);

    let output = document.getElementById('registerEventOutput');
    output.innerHTML = "";
    let message = document.createElement("h3");

    switch(true){
        case name==='':
            message.innerText = "The event must have a name!";
            output.appendChild(message);
            break;
        case description===''||description.length<20:
            message.innerText = "Event description must have at least 20 characters.";
            output.appendChild(message);
            break;
        case enrollmentPrice<0:
            message.innerText = "Invalid enrollment price.";
            output.appendChild(message);
            break;
        case day>31||day<1:
            message.innerText = "Invalid day format.";
            output.appendChild(message);
            break;
        case month>12||month<1:
            message.innerText = "Invalid month format.";
            output.appendChild(message);
            break;
        case min>60||min<0:
            message.innerText = "Invalid format for minutes.";
            output.appendChild(message);
            break;
        case hour>24||hour<0:
            message.innerText = "Invalid format for hour.";
            output.appendChild(message);
            break;
        default:
            $.ajax({
                type: "POST",
                url: "api/v1/registerEvent",
                data: JSON.stringify({name: name,
                    description: description,
                    enrollmentPrice: enrollmentPrice,
                    day: day,
                    month:month,
                    year: year,
                    hour: hour,
                    min: min
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            message.innerText = `The event \"${name}\" has been successfully registered!`;
            output.appendChild(message);
            break;
    }

}

function initializeClassifications(){

    let classificationsDiv = document.getElementById("classificationsAdmin");
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
