package com.example.Running.Events.eventEnrollment;


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
public class EventEnrollmentRequest {
    private Long eventId;
    private String username;
    private String name;
    private Gender gender;
    private CompetitiveCategory competitiveCategory;
}
