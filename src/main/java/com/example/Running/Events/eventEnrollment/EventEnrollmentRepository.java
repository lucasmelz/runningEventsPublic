package com.example.Running.Events.eventEnrollment;

import com.example.Running.Events.timeStamps.TimeStamp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventEnrollmentRepository extends JpaRepository<EventEnrollment, Long> {

    Optional<EventEnrollment> findByEventIdAndUsername(Long eventId, String username);

    Optional<List<EventEnrollment>> findEventEnrollmentByEventId(Long eventId);

}
