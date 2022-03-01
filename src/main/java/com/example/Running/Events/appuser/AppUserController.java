package com.example.Running.Events.appuser;
import com.example.Running.Events.appuser.IsUserEnrolledRequest;
import com.example.Running.Events.eventEnrollment.EventEnrollment;
import com.example.Running.Events.eventEnrollment.EventEnrollmentRequest;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "api/v1")
@AllArgsConstructor

public class AppUserController {

    private final AppUserService appUserService;

    @GetMapping(path = "getAppUserByUsername")
    public UserDetails getAppUserByUsername(@RequestParam("username") String username){
        return appUserService.loadUserByUsername(username);
    }

    @PostMapping(path = "isUserEnrolled")
    public boolean isUserEnrolled(@RequestBody IsUserEnrolledRequest isUserEnrolledRequest)
    {
        return appUserService.isUserEnrolled(isUserEnrolledRequest.getEventId(), isUserEnrolledRequest.getUsername());
    }

    @PostMapping(path = "enrollEventUser")
    public String enrollEventUser(@RequestBody EventEnrollmentRequest enrollment)
    {
        return appUserService.enrollEventUser(enrollment);
    }

    @GetMapping(path = "getEnrollmentsByUsername")
    public Optional<List<EventEnrollment>> getEnrollmentsByUsername(@RequestParam("username") String username){
        return appUserService.getEnrollmentsByUsername(username);
    }


}