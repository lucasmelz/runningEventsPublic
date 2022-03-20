package com.example.Running.Events.email;

import java.io.IOException;

import org.hibernate.cfg.Environment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.sendgrid.Content;
import com.sendgrid.Email;
import com.sendgrid.Mail;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
@AllArgsConstructor
public class EmailService implements EmailSender{

    private final static Logger LOGGER = LoggerFactory.getLogger(EmailService.class);
    @Value("${secret}")
    private String secret;


    @Override
    @Async
    public void send(String recipient, String email) {

        // the sender email should be the same as we used to Create a Single Sender Verification
        Email from = new Email("runningeventsmail@gmail.com");
        String subject = "Confirm your account at RunningEvents Platform";
        Email to = new Email("recipient");
        Content content = new Content("text/plain", email);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(secret);
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            LOGGER.info(response.getBody());
        } catch (IOException ex) {
            LOGGER.error("failed to send email", ex);
            throw new IllegalStateException("failed to send email");
        }
    }


/*
       try{
           MimeMessage mimeMessage = mailSender.createMimeMessage();
           MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
           helper.setText(email, true);
           helper.setTo(to);
           helper.setSubject("Confirm your email");
           helper.setFrom("hello@runningevents.com");
           mailSender.send(mimeMessage);
       } catch(MessagingException e){
           LOGGER.error("failed to send email", e);
           throw new IllegalStateException("failed to send email");
       }*/
}

