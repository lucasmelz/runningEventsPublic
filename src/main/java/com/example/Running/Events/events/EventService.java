package com.example.Running.Events.events;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
@AllArgsConstructor
public class EventService {
    private final EventRepository eventRepository;

    public String registerEvent(EventRegistrationRequest event){
        if(doesEventExists(event.getName())){
            throw new IllegalStateException ("event name already taken");
        }
        Event eventToBeRegistered = new Event(event.getName(), event.getDescription(),
                event.getEnrollmentPrice(), event.getDay(), event.getMonth(),
                event.getYear(), event.getHour(), event.getMin(), event.getPicture());
        eventRepository.save(eventToBeRegistered);
        return "event registered";
    }

    public boolean doesEventExists(String name){
        return eventRepository.findByName(name).isPresent();
    }

    public Optional<List<Event>> getEvents(){
        return Optional.of(eventRepository.findAll());
    }


    public Page<Event> getEventsPageable(int pageNumber, int pageSize) {
        Pageable page = PageRequest.of(pageNumber, pageSize);
        return eventRepository.findByEventStatusOrderByEventStatusAscDateAsc(page);
    }

    public Page<Event> searchEvent(int pageNumber, String searchInput){

        Pageable page = PageRequest.of(pageNumber, 4);

        //if the search input is exactly equal to the name of one or more events
        Page<Event> eventByName = eventRepository.findByNameIgnoreCase(searchInput, page);
        if(eventByName.getTotalElements()>0){
            return eventByName;
        }

        //checking if the search input is a date and returning one page with
        //corresponding events with the same day and month
        String[] barOrHyphen = new String[] {"/", "-"};

        for (String s: barOrHyphen){
            if(searchInput.contains(s)){
                int index = searchInput.indexOf(s);
                String day = "";
                String month = "";
                if(index>1){ //avoiding accessing non existent positions in the String searchInput
                    day = searchInput.substring(index-2, index);
                }
                else{
                    if(index>0) {
                        day = searchInput.substring(index - 1, index);
                    }
                }
                if(isNumeric(day)){
                    //get Month
                    if(index+2<=searchInput.length()-1){
                        month = searchInput.substring(index+1, index+3);
                        if(isNumeric(month)){
                            int dayNumber = Integer.parseInt(day);
                            int monthNumber = Integer.parseInt(month);
                            return eventRepository.findByDayAndMonth(dayNumber, monthNumber, page);
                        }
                    }
                    else{
                        if(index+1<=searchInput.length()-1){
                            month = searchInput.substring(index+1, index+2);
                            if(isNumeric(month)){
                                int dayNumber = Integer.parseInt(day);
                                int monthNumber = Integer.parseInt(month);
                                return eventRepository.findByDayAndMonth(dayNumber, monthNumber, page);
                            }
                        }
                    }
                } //end of if(day is a numeric value)
            } //end of if(input contains bar or hyphen)
        }   //end of iteration along String[] {"/", "-"}

        String[] arrayOfWordsFromInput = searchInput.split(" ");
        List<Event> events = eventRepository.findAll();
        List<Event> matchingEvents = new ArrayList<>();

        //the following nested loops will search if one of the words in the search
        //input can be found in the name or in the description of the event
        for(int i = 0; i<arrayOfWordsFromInput.length; i++){
            for(int j = 0; j<events.size(); j++){
                String eventDescription = events.get(j).getDescription().toLowerCase();
                String eventName = events.get(j).getName().toLowerCase();
                String currentWord = arrayOfWordsFromInput[i].toLowerCase();
                if(eventDescription.contains(currentWord) || eventName.contains(currentWord))
                   {
                    matchingEvents.add(events.get(j));
                   }
            }
        }
       return toPage(matchingEvents, page);
    }

    private Page<Event> toPage(List<Event> list, Pageable pageable) {
        if (pageable.getOffset() >= list.size()) {
            return Page.empty();
        }
        int startIndex = (int)pageable.getOffset();
        int endIndex = (int) ((pageable.getOffset() + pageable.getPageSize()) > list.size() ?
                list.size() :
                pageable.getOffset() + pageable.getPageSize());
        List<Event> subList = list.subList(startIndex, endIndex);
        return new PageImpl<Event>(subList, pageable, list.size());
    }

    public void setDates(){
        List<Event> events = eventRepository.findAll();
        for(int i = 0; i<events.size(); i++){
            Event currentEvent = events.get(i);
            currentEvent.setDate(LocalDateTime.of(currentEvent.getYear(),
                    Month.of(currentEvent.getMonth()), currentEvent.getDay(),
                    currentEvent.getHour(), currentEvent.getMin(), 0, 0));
            eventRepository.save(currentEvent);
        }
    }

    public void updateName(Long eventId, String newName){
        Optional<Event> event = eventRepository.findById(eventId);
        event.get().setName(newName);
        eventRepository.save(event.get());
    }

    public void updateDescription(Long eventId, String newDescription){
        Optional<Event> event = eventRepository.findById(eventId);
        event.get().setDescription(newDescription);
        eventRepository.save(event.get());
    }

    public void updateDate(Long eventId, int year, int month, int day, int hour, int min){
        Optional<Event> event = eventRepository.findById(eventId);
        event.get().setDate(LocalDateTime.of(year, Month.of(month), day,
                hour, min, 0, 0));
        event.get().setYear(year);
        event.get().setMonth(month);
        event.get().setDay(day);
        event.get().setHour(hour);
        event.get().setDay(day);
        eventRepository.save(event.get());
    }

    public void updatePrice(Long eventId, Float newPrice){
        Optional<Event> event = eventRepository.findById(eventId);
        event.get().setEnrollmentPrice(newPrice);
        eventRepository.save(event.get());
    }

    public void updateImage(Long eventId, String newImage){
        Optional<Event> event = eventRepository.findById(eventId);
        event.get().setPicture(newImage);
        eventRepository.save(event.get());
    }

    public void updateStatusOfAllEvents(){
        List<Event> events = eventRepository.findAll();
        for(int i = 0; i<events.size(); i++){
            Event currentEvent = events.get(i);
            LocalDateTime eventDate = LocalDateTime.of(currentEvent.getYear(),
                    Month.of(currentEvent.getMonth()), currentEvent.getDay(),
                    currentEvent.getHour(), currentEvent.getMin(), 0, 0);
            currentEvent.setEventStatus(currentEvent.generateStatus(eventDate));
            eventRepository.save(currentEvent);
        }
    }

    public static boolean isNumeric(String strNum) {
        if (strNum == null) {
            return false;
        }
        try {
            int d = Integer.parseInt(strNum);
        } catch (NumberFormatException nfe) {
            return false;
        }
        return true;
    }


}
