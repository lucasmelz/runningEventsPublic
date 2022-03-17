package com.example.Running.Events.events;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {


    @Query("SELECT event FROM Event event WHERE event.day = ?1 AND event.month = ?2")
    Optional<List<Event>> retrieveByDayAndMonth(@Param("dayOfMonth") int dayOfMonth,
                                      @Param("month") int month);


    Page<Event> findByNameIgnoreCase(String name, Pageable page);

    Page<Event> findByDayAndMonth (int day, int month, Pageable page);


    default Page<Event> findByEventStatusOrderByEventStatusAscDateAsc(Pageable page){
        List<Sort.Order> orders = new ArrayList<Sort.Order>();
        Sort.Order statusOrder = new Sort.Order(Sort.Direction.ASC, "EventStatus");
        orders.add(statusOrder);
        Sort.Order eventDateOrder = new Sort.Order(Sort.Direction.ASC, "Date");
        orders.add(eventDateOrder);
        List<Event> events = this.findAll(Sort.by(orders));
        final int start = (int)page.getOffset();
        final int end = Math.min((start + page.getPageSize()), events.size());
        return new PageImpl<>(events.subList(start, end), page, events.size());
    }

    Optional<Object> findByName(String name);

    Optional<Event> findById(Long eventId);

}


