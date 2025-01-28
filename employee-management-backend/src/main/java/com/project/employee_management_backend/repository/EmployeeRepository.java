package com.project.employee_management_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.project.employee_management_backend.model.Employee;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    List<Employee> findByName(String name);
    List<Employee> findByDepartmentOrderByNameAsc(String department);
    List<Employee> findByDepartmentAndRoleOrderByNameAsc(String department, String role);
    List<Employee> findByRoleOrderByNameAsc(String role);
    Boolean existsByEmail(String email);
    Boolean existsByPhoneNo(Long phone);
    Boolean existsByName(String name);
    List<Employee> findAllByOrderByNameAsc();
    List<Employee> findByDepartmentAndName(String department, String name);
    List<Employee> findByRoleAndName(String department, String role);
    List<Employee> findByDepartmentAndRoleAndName(String department, String role, String name);
}
