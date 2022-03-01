package com.example.Running.Events.eventEnrollment;

import com.example.Running.Events.events.EventRegistrationRequest;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "api/v1")
@AllArgsConstructor
public class EventEnrollmentController {

    private EventEnrollmentService eventEnrollmentService;

/*
  //Instead of using the method below to enroll users in events, we should use
  the method in AppUserController called 'enrollEventUser', since it
  simultaneously updates the eventEnrollmentRepository and updates the
  users' data concerning the list of events they enrolled.
  //If we used the method below, the enrollment is stored in the eventEnrollments
  database but not in the user's data. Using both methods causes a duplication
  of enrollments in the enrollments database

  @PostMapping(path = "enroll")
    public String enroll(@RequestBody EventEnrollmentRequest enrollment)
    {
        return eventEnrollmentService.enroll(enrollment);
    }*/

    @PostMapping(path = "getEnrollmentsByEventId")
    public Optional<List<EventEnrollment>> getEnrollmentsByEventId(@RequestBody Long eventId){
        return eventEnrollmentService.findEventEnrollmentByEventId(eventId);
    }

}
