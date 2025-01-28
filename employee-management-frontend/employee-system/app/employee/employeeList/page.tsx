'use client';
import { useState, useEffect } from 'react';
import { DeleteData, FilterData } from '@/app/utils/api';
import Image from 'next/image';
import '../styles/style.css';
import Link from 'next/link';
import { Button } from '@mui/material';
import Table from '@/app/component/Table';
import Pagination from '@/app/component/Pagination';
import Employee from '@/app/types/Employee';
import RoleList from '@/app/component/RoleList'; 

export default function EmployeeList() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [deptDropdown, setDeptDropdown] = useState(false);
  const [roleDropdown, setRoleDropdown] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [filteredDept, setFilteredDept] = useState('');
  const [filteredRole, setFilteredRole] = useState('');
  const [triggerFetch, setTriggerFetch] = useState(false);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [pageIndex, setPageIndex] = useState(1);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const triggerFetchFunction = () => {
    setTriggerFetch(true);
  };

  useEffect(() => {
    if (triggerFetch) {
      // Update your employee state after successful fetch
      setTriggerFetch(false); // Reset triggerFetch after data is fetched
    }
  }, [triggerFetch]);
  

  const deleteData = async () => {
    if (selectedIds.length === 0) return;
    try {
      await DeleteData(selectedIds);
      setMessage('Data deleted successfully!');
      triggerFetchFunction();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible((prevState) => !prevState);
  };

  const toggleDeptDropdown = () => {
    setDeptDropdown((prevState) => !prevState);
  };

  const toggleRoleDropdown = () => {
    setRoleDropdown((prevState) => !prevState);
  };

  const filterEmployee = async () => {
    try {
      const response = await FilterData(inputValue, filteredDept, filteredRole);

      if (response) {
        setFilteredData(response);
        setEmployees(response);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen p-6">
        {dropdownVisible && (
          <div className="absolute top-0 right-0 z-10 w-[400px] h-[695px] bg-white border-l border-gray-400">
            <div className="shadow-md w-full h-[50px] flex items-center">
              <Image src="/close.png" alt="close" width={32} height={32} onClick={toggleDropdown} />
              <Button
                variant="contained"
                style={{
                  backgroundColor: filteredDept === '' && filteredRole === '' ? 'lightgray' : 'blueviolet',
                  color: 'white',
                  cursor: filteredDept === '' && filteredRole === '' ? 'not-allowed' : 'pointer',
                  width: '80px',
                  height: '40px',
                  marginLeft: '160px',
                  textTransform: 'none',
                }}
                disabled={filteredDept === '' && filteredRole === ''}
                onClick={() => {
                  filterEmployee();
                  setDropdownVisible(false);
                }}
              >
                Apply
              </Button>
              <Button
                variant="contained"
                style={{
                  backgroundColor: filteredDept === '' && filteredRole === '' ? 'lightgray' : 'red',
                  color: 'white',
                  cursor: filteredDept === '' && filteredRole === '' ? 'not-allowed' : 'pointer',
                  width: '80px',
                  height: '40px',
                  marginLeft: '20px',
                  textTransform: 'none',
                }}
                disabled={filteredDept === '' && filteredRole === ''}
                onClick={() => {
                  setFilteredDept('');
                  setFilteredRole('');
                  toggleDeptDropdown();
                  toggleRoleDropdown();
                }}
              >
                Clear
              </Button>
            </div>
            <div className={`w-full ${deptDropdown ? 'h-[280px]' : 'h-[70px]'}`}>
              <div
                className="h-[70px] w-full border flex items-center pl-5 hover:shadow-md hover:bg-gray-200 bg-gray-100 font-medium text-[17px]"
                onClick={toggleDeptDropdown}
              >
                Department
                <Image src="/down-arrow.png" alt="down-arrow" width={20} height={20} />
              </div>
              <ul className={`h-[195px] w-full border ${deptDropdown ? 'block' : 'hidden'}`}>
                <li
                  className={`h-1/4 w-full border ${filteredDept === 'Design' ? 'bg-gray-400' : 'white'}`}
                  onClick={(event) => {
                    setFilteredDept((event.target as HTMLElement).textContent || '');
                  }}
                >
                  Design
                </li>
                <li
                  className={`h-1/4 w-full border ${filteredDept === 'Development' ? 'bg-gray-400' : 'white'}`}
                  onClick={(event) => setFilteredDept((event.target as HTMLElement).textContent || '')}
                >
                  Development
                </li>
                <li
                  className={`h-1/4 w-full border ${filteredDept === 'Testing' ? 'bg-gray-400' : 'white'}`}
                  onClick={(event) => setFilteredDept((event.target as HTMLElement).textContent || '')}
                >
                  Testing
                </li>
                <li
                  className={`h-1/4 w-full border ${filteredDept === 'Human Resource' ? 'bg-gray-400' : 'white'}`}
                  onClick={(event) => setFilteredDept((event.target as HTMLElement).textContent || '')}
                >
                  Human Resource
                </li>
              </ul>
            </div>
            <div className={`w-full ${roleDropdown ? 'h-[280px]' : 'h-[70px]'}`}>
              <div
                className="h-[70px] w-full border flex items-center pl-5 hover:shadow-md hover:bg-gray-200 bg-gray-100 font-medium text-[17px]"
                onClick={toggleRoleDropdown}
              >
                Designation
                <Image src="/down-arrow.png" alt="down-arrow" width={20} height={20} />
              </div>
              <ul className={`h-[195px] w-full border ${roleDropdown ? 'block' : 'hidden'}`}>
                <RoleList
                  filteredDept={filteredDept}
                  filteredRole={filteredRole}
                  setFilteredRole={setFilteredRole}
                />
              </ul>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="w-full flex items-center h-16 border-b border-gray-300 mb-2">
          <h2 className="text-2xl font-bold text-center flex-1 ml-[300px]">Employee List</h2>
          <div className="flex gap-4">
            <Link href="/employee/employeeCreation">
              <Button
                variant="contained"
                style={{
                  textTransform: 'none',
                  marginRight: '10px',
                }}
              >
                New Employee
              </Button>
            </Link>
            <Button
              variant="contained"
              style={{
                backgroundColor: selectedIds.length > 0 ? 'red' : 'lightgray',
                color: 'white',
                cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed',
              }}
              disabled={selectedIds.length <= 0}
              onClick={deleteData}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Search Form */}
        <div className="rounded-md p-4 mb-2">
          <div className="max-w-2xl mx-auto flex items-center relative">
            <button
              id="dropdown-button"
              className="flex w-[90px] h-10 items-center py-2 px-4 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-300"
              type="button"
              onClick={toggleDropdown}
            >
              <p className="mr-2">Filter</p>
              <Image src="/filter.png" alt="filter" width={16} height={16} />
            </button>

            <input
              type="search"
              onChange={(event) => {
                setInputValue(event.target.value);
              }}
              id="search-dropdown"
              className="ml-2 flex-1 p-2 pl-5 mt-0 text-md text-gray-900 bg-gray-50 border border-gray-300 rounded-l-xl rounded-r-none h-10 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search name..."
              required
            />
            <button
              onClick={filterEmployee}
              type="button"
              className="flex items-center justify-center w-10 h-10 text-sm font-medium border border-blue-500 text-white bg-blue-600 rounded-r-xl rounded-l-none hover:bg-blue-700 focus:ring-2 focus:ring-blue-300"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center text-red-500 mb-6"
                    onClick={() => {
                        triggerFetchFunction()
                    }}
            >
                <div className="ml-[1370px]">
                    <button className="border-none h-6 w-[100px] bg-gray-100 flex items-center">
                        <h2 className="text-red-500 mr-2"> Clear Filter </h2>
                        {/* <img src="/close-red.png" className="ml-2 w-3 h-3"/> */}
                        <Image src="/close-red.png" alt="close" width={12} height={12} />
                    </button>
                </div>
            </div>

        {/* Employee Table */}
        <Table 
            data={filteredData}
            reload={triggerFetch}
            pageIndex={pageIndex}
            onSelect={(selectedIds: number[]) => setSelectedIds(selectedIds)}
            sendEmployees={(data) => {setEmployees(data)}}
        />

        {/* Pagination */}
        <Pagination totalEmployees={employees.length} setCurrentPage={setPageIndex} />
      </div>
    </>
  );
}
