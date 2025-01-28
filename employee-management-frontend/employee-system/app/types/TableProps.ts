import Employee from "@/app/types/Employee";

interface TableProps {
    data: Employee[];
    pageIndex: number;
    fetch: boolean;
    onSelect: (selectedIds: number[]) => void;
    sendEmployees: (employees: Employee[]) => void;
}

export default TableProps;