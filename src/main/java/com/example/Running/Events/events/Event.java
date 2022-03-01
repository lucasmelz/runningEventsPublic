package com.example.Running.Events.events;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import javax.persistence.*;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.Month;


@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@Entity
public class Event {

    @Id
    @SequenceGenerator(
            name = "events_sequence",
            sequenceName = "events_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "events_sequence"
    )
    private Long id;
    private String name;
    private String description;
    @Enumerated(EnumType.STRING)
    private EventStatus eventStatus;
    private int day;
    private int month;
    private int year;
    private int hour;
    private int min;
    private LocalDateTime date;
    private Float enrollmentPrice;
    @Lob
    private String picture;

   public Event(String name, String description, Float enrollmentPrice, int day, int month, int year, int hour, int min, String picture) {
        this.name = name;
        this.description = description;
        this.enrollmentPrice = enrollmentPrice;
        this.day = day;
        this.month = month;
        this.year = year;
        this.hour = hour;
        this.min = min;
        this.date = LocalDateTime.of(year, Month.of(month), day, hour, min, 0, 0);
        this.eventStatus = generateStatus(this.date);
        this.picture = picture;
    }

    public Event(String name, String description, Float enrollmentPrice, int day, int month, int year, int hour, int min) {
        this.name = name;
        this.description = description;
        this.enrollmentPrice = enrollmentPrice;
        this.day = day;
        this.month = month;
        this.year = year;
        this.hour = hour;
        this.min = min;
        this.date = LocalDateTime.of(year, Month.of(month), day, hour, min, 0, 0);
        this.eventStatus = generateStatus(this.date);
    }

    public EventStatus generateStatus(LocalDateTime date){

        long daysInBetween = Duration.between(LocalDateTime.now(), date).toDays();
        if (daysInBetween<-1){
            return EventStatus.PAST;
        }
        if(daysInBetween>1){
            return EventStatus.FUTURE;
        }
        return EventStatus.CURRENT;
    }

}