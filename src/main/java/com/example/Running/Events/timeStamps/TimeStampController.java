package com.example.Running.Events.timeStamps;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.sql.Time;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "api/v1")
@AllArgsConstructor
public class TimeStampController {
    private TimeStampService timeStampService;

    @PostMapping(path = "/admin/setStart")
    public void setStart(@RequestBody TimeStampRequest start)
    {
        timeStampService.setStart(start);
    }

    @PostMapping(path = "/admin/setP1")
    public void setP1(@RequestBody TimeStampRequest p1)
    {
        timeStampService.setP1(p1);
    }

    @PostMapping(path = "/admin/setP2")
    public void setP2(@RequestBody TimeStampRequest p2)
    {
        timeStampService.setP2(p2);
    }

    @PostMapping(path = "/admin/setP3")
    public void setP3(@RequestBody TimeStampRequest p3)
    {
        timeStampService.setP3(p3);
    }

    @PostMapping(path = "/admin/setFinish")
    public void setFinish(@RequestBody TimeStampRequest finish)
    {
        timeStampService.setFinish(finish);
    }

    @PostMapping(path = "/admin/newTimeStamp")
    public void setFinish(@RequestBody NewTimeStampRequest ts)
    {
        timeStampService.newTimeStamp(ts);
    }


    @GetMapping(path = "getTimeStamps")
    public Optional<List<TimeStamp>> getTimeStamps(@RequestParam("eventId") Long eventId)
    {
        return timeStampService.getTimeStamps(eventId);
    }

    @GetMapping(path = "getAthleteTimeStamps")
    public Optional<List<TimeStamp>> getAthleteTimeStamps(@RequestParam("username") String username)
    {
        return timeStampService.getAthleteTimeStamps(username);
    }

    @GetMapping(path = "/admin/doesTimestampExists")
    public boolean doesTimestampExists(@RequestParam("username") String username,@RequestParam("eventId") Long eventId)
    {
        return timeStampService.doesTimestampExists(username, eventId);
    }

}
