package com.example.Running.Events.timeStamps;


import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class TimeStampService {
    private final TimeStampRepository timeStampRepository;

    public Optional<List<TimeStamp>> getTimeStamps(Long eventId){
        return timeStampRepository.findByEventId(eventId);
    }

    public Optional<List<TimeStamp>> getAthleteTimeStamps(String username){
        return timeStampRepository.findByUsername(username);
    }

    public void setStart(TimeStampRequest start){
        LocalDateTime s;
        if(start.nanoOfSecond==0){
            s = LocalDateTime.of(start.year, start.month, start.day,
                    start.hour, start.min, start.second);

        }
        else{
            s = LocalDateTime.of(start.year, start.month, start.day,
                    start.hour, start.min, start.second, start.nanoOfSecond);
        }
        Optional<TimeStamp> ts = timeStampRepository.findByEventIdAndUsername(start.eventId, start.username);
        ts.get().setStart(s);
        timeStampRepository.save(ts.get());    }

    public void setP1(TimeStampRequest p1){
        LocalDateTime p;
        if(p1.nanoOfSecond==0){
            p = LocalDateTime.of(p1.year, p1.month, p1.day,
                    p1.hour, p1.min, p1.second);

        }
        else{
            p = LocalDateTime.of(p1.year, p1.month, p1.day,
                    p1.hour, p1.min, p1.second, p1.nanoOfSecond);
        }
        Optional<TimeStamp> ts = timeStampRepository.findByEventIdAndUsername(p1.eventId, p1.username);
        ts.get().setP1(p);
        timeStampRepository.save(ts.get());
    }

    public void setP2(TimeStampRequest p2){
        LocalDateTime p;
        if(p2.nanoOfSecond==0){
            p = LocalDateTime.of(p2.year, p2.month, p2.day,
                    p2.hour, p2.min, p2.second);
        }
        else{
            p = LocalDateTime.of(p2.year, p2.month, p2.day,
                    p2.hour, p2.min, p2.second, p2.nanoOfSecond);
        }
        Optional<TimeStamp> ts = timeStampRepository.findByEventIdAndUsername(p2.eventId, p2.username);
        ts.get().setP2(p);
        timeStampRepository.save(ts.get());
    }

    public void setP3(TimeStampRequest p3){
        LocalDateTime p;
        if(p3.nanoOfSecond==0){
            p = LocalDateTime.of(p3.year, p3.month, p3.day,
                    p3.hour, p3.min, p3.second);
        }
        else{
            p = LocalDateTime.of(p3.year, p3.month, p3.day,
                    p3.hour, p3.min, p3.second, p3.nanoOfSecond);
        }
        Optional<TimeStamp> ts = timeStampRepository.findByEventIdAndUsername(p3.eventId, p3.username);
        ts.get().setP3(p);
        timeStampRepository.save(ts.get());
    }

    public void setFinish(@NotNull TimeStampRequest finish) {
        LocalDateTime f;
        if (finish.nanoOfSecond == 0) {
            f = LocalDateTime.of(finish.year, finish.month, finish.day,
                    finish.hour, finish.min, finish.second);
        } else {
            f = LocalDateTime.of(finish.year, finish.month, finish.day,
                    finish.hour, finish.min, finish.second, finish.nanoOfSecond);
        }
        Optional<TimeStamp> ts = timeStampRepository.findByEventIdAndUsername(finish.eventId, finish.username);
        ts.get().setFinish(f);
        timeStampRepository.save(ts.get());
    }

    public void newTimeStamp(NewTimeStampRequest request){
        Long eventId = request.eventId;
        String user = request.username;
        Optional<TimeStamp> timestamp = timeStampRepository.findByEventIdAndUsername(eventId, user);
        if(timestamp.isPresent()){
            throw new IllegalStateException("Timestamp already created!");
        }
        else{
            TimeStamp ts = new TimeStamp(request.username, request.eventId,
                    request.competitiveCategory, request.gender);
            timeStampRepository.save(ts);
        }
    }

    public boolean doesTimestampExists(String username, Long eventId){
       Optional<TimeStamp> ts = timeStampRepository.findByEventIdAndUsername(eventId, username);
       return ts.isPresent();
    }

}
