package com.example.Running.Events.registration;

import com.example.Running.Events.appuser.CompetitiveCategory;
import com.example.Running.Events.appuser.Gender;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString

public class RegistrationRequest {
    private final String firstName;
    private final String lastName;
    private final String email;
    private final String password;
    private final Gender gender;
    private final CompetitiveCategory competitiveCategory;

}
