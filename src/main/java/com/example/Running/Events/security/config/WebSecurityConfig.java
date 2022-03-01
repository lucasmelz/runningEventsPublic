package com.example.Running.Events.security.config;

import com.example.Running.Events.appuser.AppUserRole;
import com.example.Running.Events.appuser.AppUserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

@Configuration
@AllArgsConstructor
@EnableWebSecurity

public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final AppUserService appUserService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    @Autowired
    private final SecurityHandler securityHandler;

    @Override
    protected void configure(HttpSecurity http) throws Exception{
    http
            .cors().disable()
            .csrf().disable()
            .authorizeRequests()
              .antMatchers("/api/v1/getEvents")
                .permitAll()
              .antMatchers("/api/v1/isAuthenticated")
                .permitAll()
              .antMatchers("/api/v1/getEnrollmentsByEventId")
                .permitAll()
              .antMatchers("/api/v1/registration")
                .permitAll()
              .antMatchers("/index.html")
                .permitAll()
              .antMatchers("/homepage.html")
                .hasAnyRole("ADMIN", "USER")
              .antMatchers("/api/v1/username")
                .hasAnyRole("ADMIN", "USER")
              .antMatchers("/api/v1/getAppUserByUsername")
                 .hasAnyRole("ADMIN", "USER")
              .antMatchers("/api/v1/isUserEnrolled")
                 .hasAnyRole("ADMIN", "USER")
              .antMatchers("/api/v1/enrollEventUser")
                  .hasAnyRole("ADMIN", "USER")
            .antMatchers("/api/v1/admin/**")
                  .hasRole("ADMIN")
            .antMatchers("/admin.html")
                  .hasRole("ADMIN")
            .antMatchers("/api/v1/registerEvent")
                  .hasRole("ADMIN")
                .and().formLogin().successHandler(securityHandler)
            .and().logout()
                .logoutSuccessUrl("/index.html").and()
            .exceptionHandling().accessDeniedPage("/error.html");
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception{
         auth.authenticationProvider(daoAuthenticationProvider());
        auth.inMemoryAuthentication().passwordEncoder(NoOpPasswordEncoder.getInstance())
                .withUser("admin").password("admin").roles("ADMIN");
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider(){
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(bCryptPasswordEncoder);
        provider.setUserDetailsService(appUserService);
        return provider;
    }


}
