package com.widifirmaan.porto.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

//@Controller
public class ForwardingController {

     @GetMapping("/")
    public String rootRedirect() {
       return "index";
    }
}
