//package com.project.employee_management_backend.configuration;
//
//import com.project.employee_management_backend.model.Employee;
//import com.project.employee_management_backend.repository.EmployeeRepository;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration
//public class EmployeeConfig {
//
//    CommandLineRunner runner(
//            EmployeeRepository employeeRepository) {
//        return args -> {
//            Employee VK = new Employee(
//                    1,
//                    "VK",
//                    "vk@gmail.com",
//                    "Development",
//                    100000
//            );
//
//            employeeRepository.save(VK);
//        };
//    }
//}
