package com.example.Running.Events.eventEnrollment;

import com.example.Running.Events.events.Event;
import com.example.Running.Events.events.EventRegistrationRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class EventEnrollmentService {
    private EventEnrollmentRepository eventEnrollmentRepository;

    public String enroll(EventEnrollmentRequest enrollment){
        boolean eventExists = eventEnrollmentRepository.findByEventIdAndUsername(enrollment.getEventId(),
                enrollment.getUsername()).isPresent();
        if(eventExists){throw new IllegalStateException("You are already registered to this event.");}
        EventEnrollment newEnrollment = new EventEnrollment(enrollment.getEventId(),
                enrollment.getUsername(), enrollment.getPaymentReference(),
                enrollment.getName(), enrollment.getGender(), enrollment.getCompetitiveCategory());
        eventEnrollmentRepository.save(newEnrollment);
        return "enrollment successful";
    }

    public Optional<List<EventEnrollment>> findEventEnrollmentByEventId(Long eventId){
        return eventEnrollmentRepository.findEventEnrollmentByEventId(eventId);
    }

}
