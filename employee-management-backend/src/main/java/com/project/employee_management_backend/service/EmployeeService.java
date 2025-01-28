package com.project.employee_management_backend.service;

import com.project.employee_management_backend.model.Employee;
import com.project.employee_management_backend.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    /**
     * Inserts a new employee record.
     * Validates the employee details and checks for email and phone number uniqueness.
     *
     * @param employee the employee object to be inserted
     */
    public void insertEmployee(Employee employee) throws IOException {
        Employee.validateEmployee(employee);

        if (employeeRepository.existsByEmail(employee.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (employeeRepository.existsByPhoneNo(employee.getPhoneNo())) {
            throw new RuntimeException("Phone number already exists");
        }
        employeeRepository.save(employee);
    }

    /**
     * Retrieves all employees ordered by name in ascending order.
     *
     * @return a list of all employees
     */
    public List<Employee> getEmployees() {
        return employeeRepository.findAllByOrderByNameAsc();
    }

    /**
     * Filters employees based on department or role.
     * If both filters are provided, returns employees matching both criteria.
     * If only one filter is provided, returns employees matching that filter.
     * If no filter is provided, returns an empty list.
     *
     * @param dept the department to filter by
     * @param role the role to filter by
     * @return a list of filtered employees
     */
    public List<Employee> filterEmployees(String dept, String role, String name) {
        if(dept != null && name != null && role != null) {
            return employeeRepository.findByDepartmentAndRoleAndName(dept, role, name);
        }
        if(dept != null && role != null) {
            return employeeRepository.findByDepartmentAndRoleOrderByNameAsc(dept, role);
        }
        if(role != null && name != null) {
            return employeeRepository.findByRoleAndName(role, name);
        }
        if(dept != null && name != null) {
            return employeeRepository.findByDepartmentAndName(dept, name);
        }
        if(dept != null) {
            return employeeRepository.findByDepartmentOrderByNameAsc(dept);
        }
        if(role != null) {
            return employeeRepository.findByRoleOrderByNameAsc(role);
        }
        if(name != null) {
            return employeeRepository.findByName(name);
        }
        return Collections.emptyList();
    }

    /**
     * Retrieves employees by name.
     * If the name is null or empty, throws a RuntimeException.
     * If employees with the given name exist, returns the list of employee(s).
     * If no employees are found, returns an empty list.
     *
     * @param name the name of the employee(s) to search for
     * @return a list of employees with the given name
     */
    public List<Employee> getEmployeesByNameAndDept(String name, String dept) {
        if(name == null || name.isEmpty()) {
            throw new RuntimeException("Employee name cannot be empty");
        } else {
            if(employeeRepository.existsByName(name)) {
                return employeeRepository.findByDepartmentAndName(dept,name);
            } else {
                return Collections.emptyList();
            }
        }
    }

    /**
     * Updates the details of an existing employee.
     * Validates the updated employee details and checks for changes before saving.
     *
     * @param updateEmployee the employee object with updated details
     * @return a response entity containing a success or error message
     */
    public ResponseEntity<String> updateDetails(Employee updateEmployee) {
        try {
            // Validate employee details before proceeding
            Employee.validateEmployee(updateEmployee);

            // Find the employee by ID
            Optional<Employee> employeeOptional = employeeRepository.findById(updateEmployee.getId());

            if (employeeOptional.isPresent()) {
                Employee existingEmployee = employeeOptional.get();

                boolean isUpdated = Employee.checkUpdation(existingEmployee, updateEmployee);

                // Save only if there is a change
                if (isUpdated) {
                    employeeRepository.save(existingEmployee);
                    return ResponseEntity.ok("Data updated successfully");
                } else {
                    return ResponseEntity.ok("No changes detected");
                }

            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found");
            }
        } catch (Exception e) {
            // Handle any unexpected errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating employee: " + e.getMessage());
        }
    }

    /**
     * Deletes employees by a list of IDs.
     *
     * @param idList the list of employee IDs to be deleted
     * @return a response entity containing a success message
     */
    public ResponseEntity<String> deleteRecord(List<Integer> idList) {
        for (Integer id : idList) {
            if (employeeRepository.existsById(id)) {
                employeeRepository.deleteById(id);
            }
        }
        return ResponseEntity.ok("Data deleted successfully");
    }
}
