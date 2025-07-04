package com.mert.pms.controller;

import com.mert.pms.dto.AuthRequest;
import com.mert.pms.dto.AuthResponse;
import com.mert.pms.dto.EmployeeDTO;
import com.mert.pms.model.Employee;
import com.mert.pms.security.JwtTokenProvider;
import com.mert.pms.service.EmployeeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final EmployeeService employeeService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(EmployeeService employeeService, AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.employeeService = employeeService;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);
        Employee employee = employeeService.loginEmployee(authRequest.getEmail());
        AuthResponse authResponse = new AuthResponse(
                token,
                employee.getId(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getEmail(),
                employee.getRoles());
        return ResponseEntity.ok(authResponse);
    }


}
