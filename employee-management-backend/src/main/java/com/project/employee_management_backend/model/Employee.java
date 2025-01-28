package com.project.employee_management_backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data // Handles @Getter and @Setter
@NoArgsConstructor // Generates a no-arguments constructor
@AllArgsConstructor // Generates a constructor with all fields
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // Auto-generated ID column
    private String name;
    private String department;
    private String role;
    private String email;
    private Float salary;
    private Long phoneNo;
    private Integer year_of_experience;

    // Validates the input data's
    public static void validateEmployee(Employee employee) {
        if (employee.getName() == null || employee.getName().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }
        if (employee.getEmail() == null || employee.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        if (employee.getPhoneNo() == null) {
            throw new IllegalArgumentException("Phone number cannot be empty");
        }
        if (employee.getDepartment() == null || employee.getDepartment().isEmpty()) {
            throw new IllegalArgumentException("Department cannot be empty");
        }
        if (employee.getRole() == null || employee.getRole().isEmpty()) {
            throw new IllegalArgumentException("Role cannot be empty");
        }
        if (employee.getSalary() == null) {
            throw new IllegalArgumentException("Salary cannot be empty");
        }
        if (employee.getName().matches(".*[0-9].*|-.*[0-9].*")) {
            throw new IllegalArgumentException("Name cannot contain numbers");
        }
        if (!employee.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$")) {
            throw new IllegalArgumentException("Email address is not valid");
        }
        if (String.valueOf(employee.getPhoneNo()).length() != 10 || employee.getPhoneNo() < 0) {
            throw new IllegalArgumentException("Phone number is not valid");
        }
        if (employee.getSalary() < 0) {
            throw new IllegalArgumentException("Salary is not valid");
        }
    }

    public static boolean checkUpdation(Employee existingEmployee, Employee updateEmployee) {
        // Check if the employee details have changed before saving
        boolean isUpdated = false;

        if (!existingEmployee.getName().equals(updateEmployee.getName())) {
            existingEmployee.setName(updateEmployee.getName());
            isUpdated = true;
        }
        if (!existingEmployee.getDepartment().equals(updateEmployee.getDepartment())) {
            existingEmployee.setDepartment(updateEmployee.getDepartment());
            isUpdated = true;
        }
        if (!existingEmployee.getRole().equals(updateEmployee.getRole())) {
            existingEmployee.setRole(updateEmployee.getRole());
            isUpdated = true;
        }
        if (!existingEmployee.getEmail().equals(updateEmployee.getEmail())) {
            existingEmployee.setEmail(updateEmployee.getEmail());
            isUpdated = true;
        }
        if (!existingEmployee.getSalary().equals(updateEmployee.getSalary())) {
            existingEmployee.setSalary(updateEmployee.getSalary());
            isUpdated = true;
        }
        if (!existingEmployee.getPhoneNo().equals(updateEmployee.getPhoneNo())) {
            existingEmployee.setPhoneNo(updateEmployee.getPhoneNo());
            isUpdated = true;
        }

        return isUpdated;
    }
}
