// components/RoleList.tsx
import React from 'react';

interface Role {
  dept: string;
  role: string;
}

const roleList: Role[] = [
  { dept: 'Design', role: 'Graphic Designer' },
  { dept: 'Design', role: 'UI/UX Designer' },
  { dept: 'Development', role: 'Web Developer' },
  { dept: 'Development', role: 'DevOps Engineer' },
  { dept: 'Testing', role: 'Quality Analyst' },
  { dept: 'Human Resource', role: 'HR Recruiter' },
];

interface RoleListProps {
  filteredDept: string;
  filteredRole: string;
  setFilteredRole: React.Dispatch<React.SetStateAction<string>>;
}

const RoleList: React.FC<RoleListProps> = ({ filteredDept, filteredRole, setFilteredRole }) => {
  return (
    <>
      {filteredDept !== '' ? (
        roleList
          .filter((role) => role.dept === filteredDept) // Filter roles by department
          .map((role, index) => (
            <li
              key={index}
              className={`h-1/4 w-full border ${filteredRole === role.role ? 'bg-gray-400' : 'bg-white'}`}
              onClick={() => setFilteredRole(role.role)}
            >
              {role.role}
            </li>
          ))
      ) : (
        roleList.map((role, index) => (
          <li
            key={index}
            className={`h-1/4 w-full border ${filteredRole === role.role ? 'bg-gray-400' : 'bg-white'}`}
            onClick={() => setFilteredRole(role.role)}
          >
            {role.role}
          </li>
        ))
      )}
    </>
  );
};

export default RoleList;
