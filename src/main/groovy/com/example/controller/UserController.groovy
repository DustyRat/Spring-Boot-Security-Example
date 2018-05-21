package com.example.controller;

import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam

import com.example.service.UserService

@Controller
class UserController {
	
	@Autowired
	private final UserService service;
	
	@RequestMapping("/users")
	String list(Model model) {
		return "user/list";
	}
	
	@RequestMapping("/user/edit")
	String edit(HttpServletRequest request, HttpServletResponse response, @RequestParam("id") UUID id){
		if (service.exists(id)){ return "user/edit" }
		else { response.sendError(HttpStatus.NOT_FOUND.value()) }
	}
	
}
