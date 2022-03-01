package com.example.Running.Events.timeStamps;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class TimeStampRequest {

    @JsonProperty("username")
    public String username;
    @JsonProperty("eventId")
    public Long eventId;
    @JsonProperty("year")
    public int year;
    @JsonProperty("month")
    public int month;
    @JsonProperty("day")
    public int day;
    @JsonProperty("hour")
    public int hour;
    @JsonProperty("min")
    public int min;
    @JsonProperty("second")
    public int second;
    @JsonProperty("nanoOfSecond")
    public int nanoOfSecond;


    public TimeStampRequest(String username, Long eventId, int year, int month,
                            int day, int hour, int min, int second) {
        this.username = username;
        this.eventId = eventId;
        this.year = year;
        this.month = month;
        this.day = day;
        this.hour = hour;
        this.min = min;
        this.second = second;
        this.nanoOfSecond = 0;
    }

}
