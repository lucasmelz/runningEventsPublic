package com.example.Running.Events.timeStamps;

import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@NoArgsConstructor
public class FinalTime {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "final_time_sequence")
    @SequenceGenerator(name = "final_time_sequence", sequenceName = "final_time_sequence", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Long id;
    public int years;
    public int months;
    public int days;
    public int hours;
    public int minutes;
    public int seconds;
    public int nanoOfSeconds;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FinalTime(int years, int months, int days, int hours, int minutes, int seconds) {
        this.years = years;
        this.months = months;
        this.days = days;
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
        this.nanoOfSeconds = 0;
    }

    public FinalTime(int years, int months, int days, int hours, int minutes, int seconds, int nanoOfSeconds) {
        this.years = years;
        this.months = months;
        this.days = days;
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
        this.nanoOfSeconds = nanoOfSeconds;
    }
}

