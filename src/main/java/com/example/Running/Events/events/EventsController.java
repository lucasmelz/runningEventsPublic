package com.example.Running.Events.events;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "api/v1")
@AllArgsConstructor

public class EventsController {

    private final EventService eventService;

    @PostMapping(path = "registerEvent")
    public String registerEvent(@RequestBody EventRegistrationRequest event){
        return eventService.registerEvent(event);
    }

    @PostMapping(path = "updateName")
    public void updateName(@RequestParam Long eventId, @RequestParam String newName){
        eventService.updateName(eventId, newName);
    }

    @PostMapping(path = "updateDescription")
    public void updateDescription(@RequestParam Long eventId, @RequestParam String newDescription){
        eventService.updateDescription(eventId, newDescription);
    }

    @PostMapping(path = "updateDate")
    public void updateDate(@RequestParam Long eventId, @RequestParam int day, @RequestParam int month,
                           @RequestParam int year, @RequestParam int hour, @RequestParam int min){
        eventService.updateDate(eventId, year, month, day, hour, min);
    }

    @PostMapping(path = "updatePrice")
    public void updatePrice(@RequestParam Long eventId, @RequestParam Float newPrice){
        eventService.updatePrice(eventId, newPrice);
    }

    @PostMapping(path = "updateImage")
    public void updateImage(@RequestParam Long eventId, @RequestParam String newImage){
        eventService.updateImage(eventId, newImage);
    }

    @GetMapping(path = "getEvents")
    public Optional<List<Event>> getEvents(){
        return eventService.getEvents();
    }

    @GetMapping(path= "getEventsPageable")
    public Page<Event> getEventsPageable (@RequestParam(required = false, defaultValue = "0") int pageNumber, @RequestParam int pageSize){
        eventService.updateStatusOfAllEvents();
        return eventService.getEventsPageable(pageNumber, pageSize);
    }

    @GetMapping(path = "searchEvent")
    public Page<Event> searchEvent(@RequestParam(required = false, defaultValue = "0") int pageNumber, @RequestParam String searchInput){
        return eventService.searchEvent(pageNumber, searchInput);
    }

    @GetMapping(path = "getEventById")
    public Optional<Event> getEventById(@RequestParam Long eventId){
        return eventService.getEventById(eventId);
    }

    @GetMapping(path = "doesEventExists")
    public Boolean doesEventExists(@RequestParam String name){
        return eventService.doesEventExists(name);
    }

}
