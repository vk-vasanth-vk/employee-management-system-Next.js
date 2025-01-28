'use client';

import Link from "next/link";
import "../styles/style.css";
import { Button } from '@mui/material';
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createEmployee, UpdateData, UploadFile } from "../../utils/api";
import Employee from "@/app/types/Employee";

const EmployeeCreation = () => {
  // State to check if the DOM has loaded
  const [domLoaded, setDomLoaded] = useState(false);
  
  // Set domLoaded to true once the component is mounted
  useEffect(() => {
    setDomLoaded(true);
  }, []);

  // State to hold the employee form data
  const [employee, setEmployee] = useState<Employee>({
    id: "",
    name: "",
    department: "",
    role: "",
    email: "",
    salary: 0,
    phone: "",
    experience: 0,
  });

  // State for error/success messages
  const [message, setMessage] = useState("");
  
  // State to track whether it's an update operation or a create operation
  const [update, setUpdate] = useState(false);
  
  // State to handle file upload
  const [file, setFile] = useState<File | null>(null);
  
  // Router and search params for URL management
  const router = useRouter();
  const searchParams = useSearchParams();

  // List of possible roles for each department
  const roleList = [
    { dept: "Design", role: "Graphic Designer" },
    { dept: "Design", role: "UI/UX Designer" },
    { dept: "Development", role: "Web Developer" },
    { dept: "Development", role: "DevOps Engineer" },
    { dept: "Testing", role: "Quality Analyst" },
    { dept: "Human Resource", role: "HR Recruiter" },
  ];

  // Populate form fields with data from URL parameters for updating an employee
  useEffect(() => {
    if (searchParams) {
      const data = Object.fromEntries(searchParams.entries());
      if (data.id) {
        setEmployee({
          id: data.id,
          name: data.name || "",
          department: data.department || "",
          role: data.role || "",
          email: data.email || "",
          salary: Number(data.salary) || 0,
          phone: data.phone || "",
          experience: Number(data.experience) || 0,
        });
        setUpdate(true);
      }
    }
  }, [searchParams]);

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Trigger file upload when the file state changes
  useEffect(() => {
    if (file) {
      uploadFile();
    }
  }, [file]);

  // Handle form submission (either create or update employee)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) {
      console.log("Validation failed");
      return;
    }

    try {
      if (update) {
        const response = await UpdateData(
          Number(employee.id),
          employee.name,
          employee.department,
          employee.role,
          employee.email,
          employee.salary.toString(),
          employee.phone,
          employee.experience.toString()
        );
        setMessage("Employee details updated successfully");
        if (response) {
          router.push("/employee/employeeList");
        }
      } else {
        const response = await createEmployee(
          employee.name,
          employee.department,
          employee.role,
          employee.email,
          employee.salary.toString(),
          employee.phone,
          employee.experience.toString()
        );
        setMessage("Employee details created successfully");
        if (response) {
          router.push("/employee/employeeList");
        }
      }
    } catch (error) {
      console.error("Failed to update employee", error);
    }
  };

  // Handle file upload to the server
  const uploadFile = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await UploadFile(formData);
      } catch (error) {
        console.error("Failed to upload file", error);
      }
    } else {
      console.error("No file selected");
    }
  };

  // Reset the form to empty state
  const resetForm = () => {
    setEmployee({
      id: "",
      name: "",
      department: "",
      role: "",
      email: "",
      salary: 0,
      phone: "",
      experience: 0,
    });
  };

  // Handle changes in input fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  // Validate the form fields before submitting
  const validateFields = () => {
    const { name, email, role, phone, department, salary, experience } = employee;

    if (!name || !email || !role || !phone || !department || !salary || !experience || !file) {
      setMessage("All fields are required");
      return false;
    }

    if (/\d/.test(name)) {
      setMessage("Name shouldn't contain any numbers!");
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setMessage("Enter a valid email address!");
      return false;
    }

    const phoneRegex = /^\+?(\d{1,3})?[-.\s]?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/;
    if (!phoneRegex.test(phone) || phone.length < 10) {
      setMessage("Enter a valid phone number!");
      return false;
    }

    if (salary < 0) {
      setMessage("Enter a valid salary");
      return false;
    }

    return true;
  };

  return (
    <>
{domLoaded && (
  <div>
  {/* Header */}
  <div className="w-full h-[80px] border-b"></div>

  {/* Form Wrapper */}
  <div>
    {/* Notification / Message Section */}
    <div className="w-full h-10 flex justify-center text-red-500 text-[20px]">
      {/* Add dynamic message here if required */}
      {message && <p>{message}</p>}
    </div>

    {/* Form Title */}
    <h1 className="text-2xl font-bold ml-[350px]">Employee Details</h1>

    {/* Form */}
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="flex flex-row">
        {/* Labels Section */}
        <div className="flex flex-col space-y-[34px] ml-[350px] mt-[30px] min-w-[200px] h-[350px]">
          <label>Name</label>
          <label>Department</label>
          <label>Designation</label>
          <label>Email ID</label>
          <label>Phone No</label>
          <label>Salary</label>
          <label>Experience</label>
          <label>ID Proof</label>
        </div>

        {/* Inputs Section */}
        <div className="flex flex-col space-y-4">
        <input
          type="text"
          name="name" // Add the name attribute
          placeholder="Enter Name"
          value={employee.name}
          onChange={handleChange}
          className="border border-gray-400 p-2 ml-4 w-[400px]"
        />

        <select
          name="department" // Add the name attribute
          className="border border-gray-400 p-2 ml-4 w-[400px]"
          value={employee.department}
          onChange={handleChange}
        >
          <option value="">Select Department</option>
          <option value="Design">Design</option>
          <option value="Development">Development</option>
          <option value="Testing">Testing</option>
          <option value="Human Resource">Human Resource</option>
        </select>

        <select
          name="role" // Add the name attribute
          className="border border-gray-400 p-2 ml-4 w-[400px]"
          value={employee.role}
          onChange={handleChange}
          disabled={!employee.department}
          title={!employee.department ? "Select the Department" : ""}
        >
          <option value="">Select Designation</option>
          {employee.department &&
            roleList
              .filter((Role) => Role.dept === employee.department)
              .map((Role, index) => (
                <option value={Role.role} key={index}>
                  {Role.role}
                </option>
              ))}
        </select>

        <input
          type="email"
          name="email" // Add the name attribute
          placeholder="Enter Email"
          value={employee.email}
          onChange={handleChange}
          className="border border-gray-400 p-2 ml-4 w-[400px]"
        />

        <input
          type="text"
          name="phone" // Add the name attribute
          placeholder="Enter Phone no"
          maxLength={10}
          value={employee.phone}
          onChange={handleChange}
          className="border border-gray-400 p-2 ml-4 w-[400px]"
        />

        <input
          type="number"
          name="salary" // Add the name attribute
          placeholder="Enter Salary"
          value={employee.salary}
          onChange={handleChange}
          className="border border-gray-400 p-2 ml-4 w-[400px]"
        />

        <input
          type="number"
          name="experience" // Add the name attribute
          placeholder="Enter Experience"
          value={employee.experience}
          onChange={handleChange}
          className="border border-gray-400 p-2 ml-4 w-[400px]"
        />

          <input
            type="file"
            placeholder="Upload file"
            accept=".txt"
            title="Upload .txt file"
            className="border border-gray-400 p-2 ml-4 w-[400px]"
            onChange={(e) => {
              if (e.target.files) {
                setFile(e.target.files[0]);
              }
            }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row items-center justify-center space-x-4 mt-8 mb-4">
        <Button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          variant="contained"
        >
          {update ? "Save" : "Create"}
        </Button>

        <Link href="/employee/employeeList">
          <Button
            type="button"
            onClick={resetForm}
            className="bg-gray-300 border-none text-gray-500 px-4 py-2 rounded-md"
            variant="outlined"
          >
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  </div>
</div>
)}
</> 
  );
};

export default EmployeeCreation;
