package com.example.Running.Events.eventEnrollment;


import com.example.Running.Events.appuser.CompetitiveCategory;
import com.example.Running.Events.appuser.Gender;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@Entity

public class EventEnrollment {

    @SequenceGenerator(
            name = "event_enrollment_sequence",
            sequenceName = "event_enrollment_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "event_enrollment_sequence"
    )
    @Id
    private long enrollmentId;
    private long eventId;
    private String username;
    private String name;
    private Gender gender;
    private CompetitiveCategory competitiveCategory;
    boolean paid;
    private long paymentReference;

    public EventEnrollment(long eventId, String username, long paymentReference, String name,
                           Gender gender, CompetitiveCategory competitiveCategory) {
        this.eventId = eventId;
        this.username= username;
        this.paymentReference = paymentReference;
        this.paid = false;
        this.name = name;
        this.gender = gender;
        this.competitiveCategory = competitiveCategory;
    }
}
