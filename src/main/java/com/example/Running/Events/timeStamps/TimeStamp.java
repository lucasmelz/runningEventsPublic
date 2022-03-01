package com.example.Running.Events.timeStamps;

import com.example.Running.Events.appuser.CompetitiveCategory;
import com.example.Running.Events.appuser.Gender;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class TimeStamp {

    @Id
    @SequenceGenerator(
            name = "timeStamps_sequence",
            sequenceName = "timeStamps_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "timeStamps_sequence"
    )
    private Long timeStampId;
    private String username;
    private Long eventId;
    private CompetitiveCategory competitiveCategory;
    private Gender gender;
    @Nullable
    private LocalDateTime start;
    @Nullable
    private LocalDateTime p1;
    @Nullable
    private LocalDateTime p2;
    @Nullable
    private LocalDateTime p3;
    @Nullable
    private LocalDateTime finish;
    @OneToOne
    @JoinColumn(name = "final_time_id")
    private FinalTime finalTime;


    public TimeStamp(String username, Long eventId,
                     CompetitiveCategory competitiveCategory, Gender gender) {
        this.username = username;
        this.eventId = eventId;
        this.competitiveCategory = competitiveCategory;
        this.gender = gender;
    }

   public Optional<FinalTime> getFinalTime(){

        if(this.finish!=null && this.start!=null){

            LocalDateTime tempDateTime = LocalDateTime.from(this.start);

            int years = (int) tempDateTime.until(this.finish, ChronoUnit.YEARS );
            tempDateTime = tempDateTime.plusYears( years );

            int months = (int) tempDateTime.until(this.finish, ChronoUnit.MONTHS );
            tempDateTime = tempDateTime.plusMonths( months );

            int days = (int) tempDateTime.until(this.finish, ChronoUnit.DAYS );
            tempDateTime = tempDateTime.plusDays( days );

            int hours = (int) tempDateTime.until(this.finish, ChronoUnit.HOURS );
            tempDateTime = tempDateTime.plusHours( hours );

            int minutes = (int) tempDateTime.until(this.finish, ChronoUnit.MINUTES );
            tempDateTime = tempDateTime.plusMinutes( minutes );

            int seconds = (int) tempDateTime.until(this.finish, ChronoUnit.SECONDS );

            int nanoOfSeconds = (int) tempDateTime.until(this.finish, ChronoUnit.NANOS );

            this.finalTime = new FinalTime(years, days, hours, minutes, seconds, nanoOfSeconds);
            return Optional.of(this.finalTime);
        }
        return null;
    }

    public void setStart(int year, int month, int dayOfMonth, int hour, int minute, int second) {
        this.start = LocalDateTime.of(year, month, dayOfMonth, hour, minute, second);
    }

    public void setP1(int year, int month, int dayOfMonth, int hour, int minute, int second) {
        this.p1 = LocalDateTime.of(year, month, dayOfMonth, hour, minute, second);
    }

    public void setP1(int year, int month, int dayOfMonth, int hour, int minute, int second, int nanoOfSecond) {
        this.p1 = LocalDateTime.of(year, month, dayOfMonth, hour, minute, second, nanoOfSecond);
    }

    public void setP2(int year, int month, int dayOfMonth, int hour, int minute, int second) {
        this.p2 = LocalDateTime.of(year, month, dayOfMonth, hour, minute, second);
    }

    public void setP2(int year, int month, int dayOfMonth, int hour, int minute, int second, int nanoOfSecond) {
        this.p2 = LocalDateTime.of(year, month, dayOfMonth, hour, minute, second, nanoOfSecond);
    }

    public void setP3(int year, int month, int dayOfMonth, int hour, int minute, int second) {
        this.p3 = LocalDateTime.of(year, month, dayOfMonth, hour, minute, second);
    }

    public void setP3(int year, int month, int dayOfMonth, int hour, int minute, int second, int nanoOfSecond) {
        this.p3 = LocalDateTime.of(year, month, dayOfMonth, hour, minute, second, nanoOfSecond);
    }

    public void setFinish(int year, int month, int dayOfMonth, int hour, int minute, int second) {
        this.finish = LocalDateTime.of(year, month, dayOfMonth, hour, minute, second);
    }

    public void setFinish(int year, int month, int dayOfMonth, int hour, int minute, int second, int nanoOfSecond) {
        this.finish = LocalDateTime.of(year, month, dayOfMonth, hour, minute, second, nanoOfSecond);
    }
}
