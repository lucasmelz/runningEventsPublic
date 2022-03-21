package com.example.Running.Events.registration;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "api/v1/registration")
@AllArgsConstructor

public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping
    public String register(@RequestBody RegistrationRequest request){
        return registrationService.register(request);
    }

    @GetMapping(path = "confirm")
    public String confirm(@RequestParam("token") String token){
        return registrationService.confirmToken(token);
    }


    /*
    * {
    "name": "Luaasssasdasds",
    "description": "Melz",
    "day": 12,
    "month": "1",
    "year": "2022",
    "hour": 16,
    "min": 10
     }
     *
     * {
    "name": "Luaasssasdasds",
    "lastName": "Melz",
    "email": "lucaswmelz@hotmail.com",
    "password": "password",
    "gender": 0,
    "competitiveCategory": 0
}
    * */


}
