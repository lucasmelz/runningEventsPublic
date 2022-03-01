package com.example.Running.Events.appuser;

import com.example.Running.Events.eventEnrollment.EventEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
@Transactional(readOnly = true)
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String email);

    @Transactional
    @Modifying
    @Query("UPDATE AppUser a " +
            "SET a.enabled = TRUE WHERE a.email = ?1")
    int enableAppUser(String email);

    Optional<AppUser> findByUsername(String email);

    default Optional<List<EventEnrollment>> getEventEnrollmentListByUsername(String username) {
        Optional<AppUser> user = findByUsername(username);
        return Optional.ofNullable(user.get().getEventEnrollmentList());
    }

}
