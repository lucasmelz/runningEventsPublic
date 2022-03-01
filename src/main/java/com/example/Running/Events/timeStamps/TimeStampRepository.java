package com.example.Running.Events.timeStamps;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TimeStampRepository extends JpaRepository<TimeStamp, Long> {

    Optional<List<TimeStamp>> findByEventId(Long eventId);

    Optional <TimeStamp> findByEventIdAndUsername(Long eventId, String username);

    Optional<List<TimeStamp>> findByUsername (String username);


}



