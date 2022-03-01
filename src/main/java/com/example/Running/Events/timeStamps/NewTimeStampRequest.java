package com.example.Running.Events.timeStamps;


import com.example.Running.Events.appuser.CompetitiveCategory;
import com.example.Running.Events.appuser.Gender;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString

public class NewTimeStampRequest {
    public String username;
    public Long eventId;
    public CompetitiveCategory competitiveCategory;
    public Gender gender;
}
