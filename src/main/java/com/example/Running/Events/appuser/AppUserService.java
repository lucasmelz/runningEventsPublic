package com.example.Running.Events.appuser;

import com.example.Running.Events.eventEnrollment.EventEnrollment;
import com.example.Running.Events.eventEnrollment.EventEnrollmentRequest;
import com.example.Running.Events.events.Event;
import com.example.Running.Events.events.EventRepository;
import com.example.Running.Events.registration.token.ConfirmationToken;
import com.example.Running.Events.registration.token.ConfirmationTokenService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class AppUserService implements UserDetailsService {

    private final static String USER_NOT_FOUND = "user with email %s not found";
    private final AppUserRepository appUserRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final ConfirmationTokenService confirmationTokenService;
    private final EventRepository eventRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return appUserRepository.findByUsername(email)
                .orElseThrow(() -> new UsernameNotFoundException(USER_NOT_FOUND));
    }

    public String signUpUser(AppUser appUser){
        boolean userExists = appUserRepository.findByUsername(appUser.getUsername()).isPresent();

        if(userExists){throw new IllegalStateException("email already taken");}

        String encodedPassword = bCryptPasswordEncoder.encode(appUser.getPassword());

        appUser.setPassword(encodedPassword);
        appUserRepository.save(appUser);

        String token = UUID.randomUUID().toString();
        ConfirmationToken confirmationToken = new ConfirmationToken(
                token,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(15),
                appUser
        );

        confirmationTokenService.saveConfirmationToken(confirmationToken);

        return token;
    }

    public int enableAppUser(String email) {
        return appUserRepository.enableAppUser(email);
    }


    public String enrollEventUser(EventEnrollmentRequest enrollment) {

        Optional<AppUser> user = appUserRepository.findByUsername(enrollment.getUsername());
        if(!user.isPresent()){
            throw new IllegalStateException("user not found!");
        }

        Optional<Event> event = eventRepository.findById(enrollment.getEventId());
        Long paymentReference = generatePaymentReference(event.get().getEnrollmentPrice());

        EventEnrollment newEnrollment = new EventEnrollment(enrollment.getEventId(),
                enrollment.getUsername(), paymentReference,
                enrollment.getName(), enrollment.getGender(), enrollment.getCompetitiveCategory());
        user.get().addEnrollment(newEnrollment);
        appUserRepository.save(user.get());
        return ""+paymentReference;
    }

    public boolean isUserEnrolled(Long eventId, String username) {
        Optional<AppUser> user = appUserRepository.findByUsername(username);
        if(!user.isPresent()){
            throw new IllegalStateException("user not found!");
        }

        for (EventEnrollment event : user.get().getEventEnrollmentList()) {
            if (user.get().getUsername().equals(username)
                    && Objects.equals(event.getEventId(), eventId)) {
                return true; //user already enrolled in event
            }
        }
        return false;

    }

    public Optional<List<EventEnrollment>> getEnrollmentsByUsername (String username){
        return appUserRepository.getEventEnrollmentListByUsername(username);
    }

    private Long generatePaymentReference(Float enrollmentPrice){
        return Long.parseLong("" + (int)(Math.floor(Math.random()*(9)+0)) + "" + (int)(Math.floor(Math.random()*(9)+0)) + ""
                + (int)(Math.floor(Math.random()*(9)+0)) + "" + (int)(Math.floor(Math.random()*(9)+0)) + ""
                + (int)(Math.floor(Math.random()*(9)+0)) + ""+ (int)(Math.floor(Math.random()*(9)+0)) + ""
                + (int)(Math.floor(Math.random()*(9)+0)) + ""+ (int)(Math.floor(Math.random()*(9)+0)) + ""
                + (int)(Math.floor(Math.random()*(9)+0)));
    }
}
