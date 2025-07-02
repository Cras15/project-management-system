package com.mert.pms.security;

import com.mert.pms.model.Employee;
import com.mert.pms.repository.EmployeeRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomEmployeeDetailsService implements UserDetailsService {
    private final EmployeeRepository employeeRepository;

    public CustomEmployeeDetailsService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Employee user = employeeRepository.findByEmail(email);

        if (user != null && user.getRole() != null) {
            GrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().name());
            return new org.springframework.security.core.userdetails.User(user.getEmail(),
                    user.getPassword(),
                    Collections.singletonList(authority));
        } else {
            throw new UsernameNotFoundException("Geçersiz e-posta veya şifre.");
        }
    }
}
