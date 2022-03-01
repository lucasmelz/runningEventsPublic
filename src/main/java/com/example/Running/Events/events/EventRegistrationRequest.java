package com.example.Running.Events.events;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString

public class EventRegistrationRequest {
    private final String name;
    private final String description;
    private final Float enrollmentPrice;
    private final int day;
    private final int month;
    private final int year;
    private final int hour;
    private final int min;
    private final String picture;
}
