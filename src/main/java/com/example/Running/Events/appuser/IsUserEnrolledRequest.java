package com.example.Running.Events.appuser;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class IsUserEnrolledRequest{
    private Long eventId;
    private String username;
}
