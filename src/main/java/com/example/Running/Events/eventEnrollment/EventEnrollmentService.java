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

    public Optional<List<EventEnrollment>> findEventEnrollmentByEventId(Long eventId){
        return eventEnrollmentRepository.findEventEnrollmentByEventId(eventId);
    }

    public void confirmPayment (Long eventEnrollmentId){
        Optional<EventEnrollment> enrollment = eventEnrollmentRepository.findEventEnrollmentByEnrollmentId(eventEnrollmentId);
        if(!enrollment.isPresent()){
            throw new IllegalStateException("there isn't an enrollment with this id");
        }
        else{
            enrollment.get().setPaid(true);
            eventEnrollmentRepository.save(enrollment.get());
        }
    }

}
