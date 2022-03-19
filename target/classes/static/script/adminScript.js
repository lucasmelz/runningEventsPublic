$(function () { // Same as document.addEventListener("DOMContentLoaded"...
    document.getElementById('classificationsButton').addEventListener("click", function () {
        displayAndHide('classificationsAdmin');
        setClassificationsOptions();
    });
    document.getElementById('eventManagementButton').addEventListener("click", function () {
        displayAndHide('eventManagement');
    });
    document.getElementById('recordTimestampsButton').addEventListener("click", function () {
        displayAndHide('recordTimestamps');
        setRecordTimestamps();
    });
    document.getElementById('logoutButton').addEventListener("click", function () {
        window.location.replace("/logout");
    });
    document.getElementById('createNewEventButton').addEventListener("click", function () {
        if(!this.className.includes('active')) {
            this.className += ' active';
        }
        document.querySelector('#updateEventInfoButton').setAttribute("class", "eventMngButton");
        document.querySelector('#updateEventInfoContainer').style.display = 'none';
        document.querySelector('#registerEventContainer').style.display = 'inherit';
        document.querySelector('#registerEventOutput').innerHTML = "";
        window.scrollTo(0,document.body.scrollHeight);
    });
    document.getElementById('updateEventInfoButton').addEventListener("click", function () {
        if(!this.className.includes('active')) {
            this.className += ' active';
        }
        document.querySelector('#createNewEventButton').setAttribute("class", "eventMngButton");
        document.querySelector('#registerEventContainer').style.display = 'none';
        document.querySelector('#updateEventInfoContainer').style.display = 'inherit';
        setUpdateEventInfo();
        window.scrollTo(0,document.body.scrollHeight);
    });
    document.getElementById('submitRegisterEvent').addEventListener("click", function (){
        registerEvent();
    });
    setClassificationsOptions();

})

function displayAndHide(section){
    const menuItems = ['classificationsAdmin', 'eventManagement', 'recordTimestamps'];
    for(let i = 0; i<menuItems.length; i++){
        document.getElementById(menuItems[i]).style.display = "none";
    }
    document.getElementById(section).style.display = "inherit";
}


function registerEvent(){

    let name = document.getElementById("eventNameForm").value;

    $.get("api/v1/doesEventExists", {name: name}, function (){}).done(function(data){

        let output = document.getElementById('registerEventOutput');
        output.innerHTML = "";
        let message = document.createElement("h4");

        if(!data){ //if there isn't an event with that particular name, create a new event

            let description = document.getElementById('descriptionForm').value;
            let enrollmentPrice = Number(document.getElementById('enrollmentPriceForm').value);
            let day = Number(document.getElementById('dayForm').value);
            let month = Number(document.getElementById('monthForm').value);
            let year = Number(document.getElementById('yearForm').value);
            let hour = Number(document.getElementById('hourForm').value);
            let min = Number(document.getElementById('minForm').value);
            let picture = "";

            let filesSelected = document.getElementById("imageFile").files;
            if (filesSelected.length > 0) {
                var fileToLoad = filesSelected[0];
                var fileReader = new FileReader();
                fileReader.onload = function (fileLoadedEvent) {
                    picture = fileLoadedEvent.target.result; // <--- data: base64
                    registerEventRequest(name, description, enrollmentPrice, day,
                        month, year, hour, min, picture);
                }
                fileReader.readAsDataURL(fileToLoad);
            }
            else{
                registerEventRequest(name, description, enrollmentPrice, day,
                    month, year, hour, min, picture);
            }
        }
        else{ //if there's already an event with that particular name
            message.innerText = "There's an event with that same name! Find another name."
            output.appendChild(message);
        }
    })
}

function registerEventRequest(name, description, enrollmentPrice, day, month, year, hour, min, picture){

    let output = document.getElementById('registerEventOutput');
    output.innerHTML = "";
    let message = document.createElement("h4");

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
                    min: min,
                    picture: picture
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

function setUpdateEventInfo() {

    let container = document.querySelector('#updateEventInfoContainer');

    $.get("/api/v1/getEvents", "", function (){}).done(function (data){

        let lastListOfOptions = document.querySelector('#listOfOptions');
        if(document.contains(lastListOfOptions)){
            lastListOfOptions.remove();
        }
        container.innerHTML = "";

        events = JSON.parse(JSON.stringify(data));
        events = events.sort(sortBy("name"));

        let eventSelector = document.createElement("select");
        eventSelector.setAttribute("id", "eventSelectorEventManagement");

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

        eventSelector.addEventListener("change", function(){
            updateEventInfoOptions();
        });


        let h4 = document.createElement("h4");
        h4.innerText = "Select event:"
        container.appendChild(h4);
        container.appendChild(eventSelector);

    })
}

function updateEventInfoOptions(){

    let lastListOfOptions = document.querySelector('#listOfOptions');
    if(document.contains(lastListOfOptions)){
        lastListOfOptions.remove();
    }

    let eventId = document.querySelector('#eventSelectorEventManagement').value;

    let listOfOptions = document.createElement("div");
    listOfOptions.setAttribute("id", "listOfOptions");
    let options = ['Update name', 'Update description', 'Update date', 'Update enrollment price', 'Update image'];
    let functionNames = ['updateName', 'updateDescription', 'updateDate', 'updatePrice', 'updateImage'];
    for(let i = 0; i<options.length; i++){
        let divOption = document.createElement("div");
        divOption.setAttribute("id", functionNames[i]);
        let option = document.createElement("button");
        option.setAttribute("id", functionNames[i] + "Button");
        option.setAttribute('onclick', `${functionNames[i]}(${eventId})`);
        option.innerText = options[i];
        divOption.appendChild(option);
        listOfOptions.appendChild(divOption);
    }
    document.querySelector('#updateEventInfoContainer').appendChild(listOfOptions);
}

function updateName(eventId){
    let div = document.querySelector('#updateName');
    let updateNameButton = document.querySelector('#updateNameButton');
    if(updateNameButton.className.includes("active")){
        updateNameButton.setAttribute("class", "");
    }
    else{
        updateNameButton.className += "active";
    }

    if(updateNameButton.className.includes("active")){
        let updateNameConfig = document.createElement("div");
        updateNameConfig.setAttribute("id", "updateNameConfig")
        let span = document.createElement("span");
        span.innerText = "New name: ";
        let input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("id", "newNameInput");
        let button = document.createElement("button");
        button.setAttribute("class", "confirm");
        button.addEventListener("click", function (){
            confirmNewName(eventId);
        });
        button.innerText = "Confirm new name."
        updateNameConfig.appendChild(span);
        updateNameConfig.appendChild(input);
        updateNameConfig.appendChild(button);
        div.appendChild(updateNameConfig);
        collapseEventManagementUpdateOptions('updateNameConfig');
    }
    else
        document.querySelector('#updateNameConfig').remove();
}

function confirmNewName(eventId){

     let selector = document.querySelector('#eventSelectorEventManagement');
     let oldName = selector.options[selector.selectedIndex].text;
     let newName = document.querySelector('#newNameInput').value;

     $.post("api/v1/updateName", {eventId: eventId, newName: newName},
      function (){})
         .done(function (){
          window.alert("Successfully changed event name from \'" + oldName +
          "\' to \'" + newName + "\'.");
      })
         .fail(function(){
             window.alert("Sorry, some error occurred. Try again, if the error persists," +
                 "contact the company.");
         });
}

function updateDescription(eventId){

    let div = document.querySelector('#updateDescription');
    let updateDescriptionButton = document.querySelector('#updateDescriptionButton');

    if(updateDescriptionButton.className.includes("active")){
        updateDescriptionButton.setAttribute("class", "");
    }
    else{
        updateDescriptionButton.className += "active";
    }

    if(updateDescriptionButton.className.includes("active")){
        let updateDescriptionConfig = document.createElement("div");
        updateDescriptionConfig.setAttribute("id", "updateDescriptionConfig")
        let input = document.createElement("textarea");
        input.setAttribute("rows", "3");
        input.setAttribute("cols", "40");
        input.setAttribute("id", "newDescriptionInput");
        let button = document.createElement("button");
        button.setAttribute("class", "confirm");
        button.innerText = "Confirm new description."
        button.addEventListener("click", function (){
            confirmNewDescription(eventId);
        });
        updateDescriptionConfig.appendChild(input);
        updateDescriptionConfig.appendChild(button);
        div.appendChild(updateDescriptionConfig);
        collapseEventManagementUpdateOptions('updateDescriptionConfig');
    }
    else
        document.querySelector('#updateDescriptionConfig').remove();
}

function confirmNewDescription(eventId){

    let newDescription = document.querySelector('#newDescriptionInput').value;

    $.post("api/v1/updateDescription", {eventId: eventId, newDescription: newDescription},
        function (){})
        .done(function (){
            window.alert("Successfully changed event description.");
        })
        .fail(function(){
            window.alert("Sorry, some error occurred. Try again, if the error persists," +
                "contact the company.");
        });
}

function updateDate(eventId){

    let div = document.querySelector('#updateDate');
    let updateDateButton = document.querySelector('#updateDateButton');

    if(updateDateButton.className.includes("active")){
        updateDateButton.setAttribute("class", "");
    }
    else{
        updateDateButton.className += "active";
    }

    if(updateDateButton.className.includes("active")){

        let updateDateConfig = document.createElement("div");
        updateDateConfig.setAttribute("id", "updateDateConfig")

        let dayInput = document.createElement("input");
        let monthInput = document.createElement("input");
        let yearInput = document.createElement("input");
        let hourInput = document.createElement("input");
        let minInput = document.createElement("input");

        dayInput.setAttribute("type", "text");
        monthInput.setAttribute("type", "text");
        yearInput.setAttribute("type", "text");
        hourInput.setAttribute("type", "text");
        minInput.setAttribute("type", "text");

        dayInput.setAttribute("id", "dayInput");
        monthInput.setAttribute("id", "monthInput");
        yearInput.setAttribute("id", "yearInput");
        hourInput.setAttribute("id", "hourInput");
        minInput.setAttribute("id", "minInput");

        let spanDay = document.createElement("span");
        spanDay.innerText = "Day: ";
        updateDateConfig.appendChild(spanDay);
        updateDateConfig.appendChild(dayInput);

        let spanMonth = document.createElement("span");
        spanMonth.innerText = "Month: ";
        updateDateConfig.appendChild(spanMonth);
        updateDateConfig.appendChild(monthInput);

        let spanYear = document.createElement("span");
        spanYear.innerText = "Year: ";
        updateDateConfig.appendChild(spanYear);
        updateDateConfig.appendChild(yearInput);
        updateDateConfig.appendChild(document.createElement("br"));

        let spanHour = document.createElement("span");
        spanHour.setAttribute("id", "spanHour");
        spanHour.innerText = "Hour: ";
        updateDateConfig.appendChild(spanHour);
        updateDateConfig.appendChild(hourInput);

        let spanMin = document.createElement("span");
        spanMin.setAttribute("id", "spanMin");
        spanMin.innerText = "Minutes: ";
        updateDateConfig.appendChild(spanMin);
        updateDateConfig.appendChild(minInput);
        updateDateConfig.appendChild(document.createElement("br"));

        let button = document.createElement("button");
        button.setAttribute("class", "confirm");
        button.innerText = "Confirm new date."
        button.addEventListener("click", function (){
            confirmNewDate(eventId);
        });
        updateDateConfig.appendChild(button);
        div.appendChild(updateDateConfig);
        collapseEventManagementUpdateOptions('updateDateConfig');
    }
    else
        document.querySelector('#updateDateConfig').remove();
}

function confirmNewDate(eventId){
    let day = document.querySelector("#dayInput").value;
    let month = document.querySelector("#monthInput").value;
    let year = document.querySelector("#yearInput").value;
    let hour = document.querySelector("#hourInput").value;
    let min = document.querySelector("#minInput").value;

    $.post("api/v1/updateDate", {eventId: eventId, day: day, month: month,
            year: year, hour: hour, min: min},
        function (){})
        .done(function (){
            window.alert("Successfully changed event date.");
        })
        .fail(function(){
            window.alert("Sorry, some error occurred. Try again, if the error persists," +
                "contact the company.");
        });
}

function updatePrice(eventId){
    let div = document.querySelector('#updatePrice');
    let updatePriceButton = document.querySelector('#updatePriceButton');

    if(updatePriceButton.className.includes("active")){
        updatePriceButton.setAttribute("class", "");
    }
    else{
        updatePriceButton.className += "active";
    }

    if(updatePriceButton.className.includes("active")){
        let updatePriceConfig = document.createElement("div");
        updatePriceConfig.setAttribute("id", "updatePriceConfig")
        let span = document.createElement("span");
        span.innerText = "New price: ";
        let input = document.createElement("input");
        input.setAttribute("id", "priceInput");
        input.setAttribute("type", "text");
        let button = document.createElement("button");
        button.setAttribute("class", "confirm");
        button.innerText = "Confirm new price."
        button.addEventListener("click", function (){
            confirmNewPrice(eventId);
        });
        updatePriceConfig.appendChild(span);
        updatePriceConfig.appendChild(input);
        updatePriceConfig.appendChild(button);
        div.appendChild(updatePriceConfig);
        collapseEventManagementUpdateOptions('updatePriceConfig');
    }
    else
        document.querySelector('#updatePriceConfig').remove();
}

function confirmNewPrice(eventId){
    let newPrice = document.querySelector("#priceInput").value;

    $.post("api/v1/updatePrice", {eventId: eventId, newPrice: newPrice},
        function (){})
        .done(function (){
            window.alert("Successfully changed event price.");
        })
        .fail(function(){
            window.alert("Sorry, some error occurred. Try again, if the error persists," +
                "contact the company.");
        });

}

function updateImage(eventId){

    let div = document.querySelector('#updateImage');
    let updateImageButton = document.querySelector('#updateImageButton');

    if(updateImageButton.className.includes("active")){
        updateImageButton.setAttribute("class", "");
    }
    else{
        updateImageButton.className += "active";
    }

    if(updateImageButton.className.includes("active")){
        let updateImageConfig = document.createElement("div");
        updateImageConfig.setAttribute("id", "updateImageConfig")
        let input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("id", "imageInput");
        let button = document.createElement("button");
        button.setAttribute("class", "confirm");
        button.addEventListener("click", function (){
            confirmNewImage(eventId);
        });
        button.innerText = "Upload new image."
        updateImageConfig.appendChild(input);
        updateImageConfig.appendChild(button);
        div.appendChild(updateImageConfig);
        collapseEventManagementUpdateOptions('updateImageConfig');
    }
    else
        document.querySelector('#updateImageConfig').remove();
}

function confirmNewImage(eventId){

    let filesSelected = document.getElementById("imageInput").files;
    let picture = "";
    if (filesSelected.length > 0) {
        let fileToLoad = filesSelected[0];
        let fileReader = new FileReader();
        fileReader.onload = function (fileLoadedEvent) {
            picture = fileLoadedEvent.target.result; // <--- data: base64
            $.post("api/v1/updateImage", {eventId: eventId, newImage: picture},
                function (){})
                .done(function (){
                    window.alert("Successfully changed image.");
                })
                .fail(function(){
                    window.alert("Sorry, some error occurred. Try again, if the error persists," +
                        "contact the company.");
                });
        }
        fileReader.readAsDataURL(fileToLoad);
    }
}

function setRecordTimestamps(){
    let container = document.querySelector('#selectEventToRecordTSContainer');
    document.querySelector('#recordOptions').innerHTML = "";

    $.get("/api/v1/getEvents", "", function (){}).done(function (data){

        let lastListOfOptions = document.querySelector('#listOfEventsToRecordTimestamps');
        if(document.contains(lastListOfOptions)){
            lastListOfOptions.remove();
        }
        container.innerHTML = "";

        events = JSON.parse(JSON.stringify(data));
        events = events.sort(sortBy("name"));

        let eventSelector = document.createElement("select");
        eventSelector.setAttribute("id", "eventSelectorRecordTimestamps");
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

        eventSelector.addEventListener("change", function(){
            startRecordingTimestamps();
        });


        let h4 = document.createElement("h4");
        h4.innerText = "Select event:"
        container.appendChild(h4);
        container.appendChild(eventSelector);
    })
}

function startRecordingTimestamps(){
    let container = document.querySelector("#recordOptions");
    container.innerHTML = "";
    let eventSelector = document.querySelector("#eventSelectorRecordTimestamps");
    let eventId = eventSelector.options[eventSelector.selectedIndex].value;

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
        let selectAthlete = document.createElement("select");
        selectAthlete.setAttribute("id", "selectAthlete");

        enrollments.sort(function(a, b){
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
        })

        let disabledOption = document.createElement("option");
        disabledOption.text = "";
        disabledOption.setAttribute("disabled", "disabled");
        disabledOption.setAttribute("selected", "selected");
        selectAthlete.appendChild(disabledOption);

        for(let i = 0; i<enrollments.length; i++){
            let option = document.createElement("option");
            option.value = enrollments[i]['username'];
            option.text = enrollments[i]['name'];
            selectAthlete.appendChild(option);
        }

        selectAthlete.addEventListener("change", function (){
           setTimestamps(eventId);
        });

        paragraph.innerText = "Select an athlete: ";
        paragraph.setAttribute("class", "selectionParagraph");
        paragraph.appendChild(document.createElement("br"));
        paragraph.appendChild(selectAthlete);
        paragraph.appendChild(document.createElement("br"));
        container.appendChild(paragraph);
    })
}

function setTimestamps(eventId){

    let inputs = document.getElementById('timestampInputs');
    if (!!inputs){
        inputs.remove();
    }

    let divTimestampInputs = document.createElement("div");
    divTimestampInputs.setAttribute("id", "timestampInputs");

    let paragraph = document.createElement("p");
    paragraph.innerText = "Select point corresponding to the timestamp ";
    let s = document.createElement("select");
    s.setAttribute("id", "selectPoint");
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
    paragraph.appendChild(document.createElement("br"));
    paragraph.appendChild(s);
    paragraph.setAttribute("class", "selectionParagraph");
    divTimestampInputs.appendChild(paragraph);

    //these next paragraphs will contain the input boxes for registering the athletes' timestamps

    let paragraph2 = document.createElement("p");

    //day input
    paragraph2.innerText = "Day: ";
    let day = document.createElement("input");
    day.setAttribute("type", "text");
    day.setAttribute("id", "recordDay");
    day.setAttribute("style", "width:25px;");
    paragraph2.appendChild(day);

    //month input
    let text = document.createTextNode("  Month: ");
    paragraph2.appendChild(text);
    let monthSelector = document.createElement("select");
    monthSelector.setAttribute("id", "recordMonth")
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
    year.setAttribute("id", "recordYear");
    year.setAttribute("style", "width:40px;");
    paragraph2.appendChild(year);

    let paragraph3 = document.createElement("p");

    //hour input
    text = document.createTextNode(" Hour: ");
    paragraph3.appendChild(text);
    let hour = document.createElement("input");
    hour.setAttribute("type", "text");
    hour.setAttribute("id", "recordHour");
    hour.setAttribute("style", "width:25px;");
    paragraph3.appendChild(hour);

    //minutes input
    text = document.createTextNode(" Minutes: ");
    paragraph3.appendChild(text);
    let min = document.createElement("input");
    min.setAttribute("type", "text");
    min.setAttribute("id", "recordMin");
    min.setAttribute("style", "width:25px;");
    paragraph3.appendChild(min);

    //seconds input
    text = document.createTextNode(" Seconds: ");
    paragraph3.appendChild(text);
    let seconds = document.createElement("input");
    seconds.setAttribute("type", "text");
    seconds.setAttribute("id", "recordSeconds");
    seconds.setAttribute("style", "width:25px;");
    paragraph3.appendChild(seconds);

    let paragraph4 = document.createElement("p");

    //milliseconds
    text = document.createTextNode(" Milliseconds: ");
    paragraph4.appendChild(text);
    let milliseconds = document.createElement("input");
    milliseconds.setAttribute("type", "text");
    milliseconds.setAttribute("id", "recordMilliseconds");
    milliseconds.setAttribute("style", "width:45px;");
    milliseconds.setAttribute("value", "0");
    paragraph4.appendChild(milliseconds);

    paragraph2.setAttribute("style", "font-size:0.8em; text-align:center;" +
        "width: 270px;");
    paragraph3.setAttribute("style", "font-size:0.8em; text-align:center;");
    paragraph4.setAttribute("style", "font-size:0.8em; text-align:center;");

    divTimestampInputs.appendChild(paragraph2);
    divTimestampInputs.appendChild(paragraph3);

    let submitTimestamp = document.createElement("button");
    submitTimestamp.addEventListener("click", function (){
        recordTimestamp(eventId);
    });
    submitTimestamp.innerText = "Submit timestamp."
    paragraph4.appendChild(submitTimestamp);

    divTimestampInputs.appendChild(paragraph4);
    document.getElementById("recordOptions").appendChild(divTimestampInputs);

}

function recordTimestamp(eventId){


    let nameSelector = document.getElementById("selectAthlete");
    let username = nameSelector.options[nameSelector.selectedIndex].value;
    let pointSelector = document.getElementById("selectPoint");
    let point = pointSelector.options[pointSelector.selectedIndex].value;

    let year = document.getElementById("recordYear").value;
    let monthSelector = document.getElementById("recordMonth");
    let month = monthSelector.options[monthSelector.selectedIndex].value;
    let day = document.getElementById("recordDay").value;
    let hour = document.getElementById("recordHour").value;
    let min = document.getElementById("recordMin").value;
    let seconds = document.getElementById("recordSeconds").value;
    let milliseconds = document.getElementById("recordMilliseconds").value;

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
                }).done(function(){
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

function collapseEventManagementUpdateOptions(sectionNotToBeCollapsed) {

    let sections = ['updateNameConfig', 'updateDescriptionConfig', 'updateDateConfig',
        'updatePriceConfig', 'updateImageConfig'];

    sections = sections.filter(section => section !== sectionNotToBeCollapsed);

    sections.forEach((section) => {
        let i = section.indexOf("Config");
        let btn = section.substring(0, i);
        let s = document.querySelector('#' + section);
        let b = document.querySelector('#' + btn + 'Button');
        if(document.contains(s)){
            s.remove();
        }
        if(b.className.includes("active")){
            b.setAttribute("class", "");
        }
    });
}

function sortBy(prop) {
    return function(a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    }
}