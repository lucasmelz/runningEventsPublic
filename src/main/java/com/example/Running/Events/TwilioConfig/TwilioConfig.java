package com.example.Running.Events.TwilioConfig;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties("twilio")
public class TwilioConfig {

    private String api_key;

    public TwilioConfig() {

    }

    public String getApi_key() {
        return api_key;
    }

    public void setApi_key(String api_key) {
        this.api_key = api_key;
    }
}
