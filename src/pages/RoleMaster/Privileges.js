import React, { useMemo, Fragment, useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Container,
  Table,
  Row,
  Col,
  Button,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
} from "react-table";
import PropTypes from "prop-types";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link, useParams } from "react-router-dom";
import deleteimg from "../../assets/images/delete.png";
import { toast } from "react-toastify";

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);

  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <>
      <Col md={4}>
        <Input
          type="text"
          className="form-control"
          placeholder={`Search ${count} records...`}
          value={value || ""}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
        />
      </Col>
      
    </>
  );
}

function Filter() {
  return null;
}

const TableContainer = ({
  columns,
  data,
  customPageSize,
  className,
  isGlobalFilter,
  setModalOpen,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter },
      initialState: {
        pageIndex: 0,
        pageSize: customPageSize,
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  );

  const { pageIndex, pageSize } = state;

  return (
    <Fragment>
      <Row className="mb-2">
        <Col md={2}>
          <select
            className="form-select"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </Col>
        {isGlobalFilter && (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        )}
        {/* <Col md={6}>
          <div className="d-flex justify-content-end">
            <Link to="/add-project" className="btn btn-primary">
              Add
            </Link>
          </div>
        </Col> */}
      </Row>

      <div className="table-responsive react-table">
        <Table bordered hover {...getTableProps()} className={className}>
          <thead className="table-light table-nowrap">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th key={column.id}>
                    <div {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={row.id}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} key={cell.column.id}>
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      <Row className="justify-content-md-end justify-content-center align-items-center mt-3">
        <Col className="col-md-auto">
          <div className="d-flex gap-1">
            <Button
              color="primary"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              {"<<"}
            </Button>
            <Button
              color="primary"
              onClick={previousPage}
              disabled={!canPreviousPage}
            >
              {"<"}
            </Button>
          </div>
        </Col>
        <Col className="col-md-auto d-none d-md-block">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </Col>
        <Col className="col-md-auto">
          <Input
            type="number"
            min={1}
            max={pageOptions.length}
            style={{ width: 70 }}
            value={pageIndex + 1}
            onChange={(e) => gotoPage(Number(e.target.value) - 1)}
          />
        </Col>
        <Col className="col-md-auto">
          <div className="d-flex gap-1">
            <Button color="primary" onClick={nextPage} disabled={!canNextPage}>
              {">"}
            </Button>
            <Button
              color="primary"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {">>"}
            </Button>
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

TableContainer.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  customPageSize: PropTypes.number,
  className: PropTypes.string,

  isGlobalFilter: PropTypes.bool,
  setModalOpen: PropTypes.func.isRequired,
};
const Privileges = () => {
  const [projectData, setprojectData] = useState([
    {
      id: 1,
      createdDate: "2024-06-01",
      projectName: "Role Master",

      projectstatus: "Inactive",
      add: "Inactive",
      edit: "Active",
      delete: "Inactive",
      list: "Active",
    },
    {
      id: 2,
      createdDate: "2024-06-10",
      projectName: "Employee",

      projectstatus: "Active",
      add: "Active",
      edit: "Active",
      delete: "Active",
      list: "Inactive",
    },
    {
      id: 3,
      createdDate: "2024-05-20",
      projectName: "Client",

      projectstatus: "Inactive",
      add: "Inactive",
      edit: "Active",
      delete: "Inactive",
      list: "Inactive",
    },
    {
      id: 4,
      createdDate: "2024-06-03",
      projectName: "Project",

      projectstatus: "Active",
      add: "Active",
      edit: "Inactive",
      delete: "Active",
      list: "Inactive",
    },
    {
      id: 5,
      createdDate: "2024-06-08",
      projectName: "Task",

      projectstatus: "Inactive",
      add: "Inactive",
      edit: "Active",
      delete: "Inactive",
      list: "Active",
    },
    {
      id: 6,
      createdDate: "2024-06-15",
      projectName: "Task View",
      projectstatus: "Active",

      add: "Active",
      edit: "Inactive",
      delete: "Active",
      list: "Inactive",
    },
  ]);

  const { id } = useParams(); // 👈 make sure route has :id




  const [masterChecked, setMasterChecked] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen1, setModalOpen1] = useState(false);

  const handleToggle = (id, field) => {
    setprojectData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: item[field] === "Active" ? "Inactive" : "Active",
            }
          : item
      )
    );
  };
const handleMasterCheckboxToggle = () => {
  const newStatus = !masterChecked;
  setMasterChecked(newStatus);

  const updatedData = projectData.map((item) => ({
    ...item,
    projectstatus: newStatus ? "Active" : "Inactive",
    add: newStatus ? "Active" : "Inactive",
    edit: newStatus ? "Active" : "Inactive",
    delete: newStatus ? "Active" : "Inactive",
    list: newStatus ? "Active" : "Inactive",
  }));

  setprojectData(updatedData);
};


 const handleCheckboxToggle = (id) => {
  const updatedData = projectData.map((item) =>
    item.id === id
      ? {
          ...item,
          projectstatus: item.projectstatus === "Active" ? "Inactive" : "Active",
          add: item.projectstatus === "Active" ? "Inactive" : "Active",
          edit: item.projectstatus === "Active" ? "Inactive" : "Active",
          delete: item.projectstatus === "Active" ? "Inactive" : "Active",
          list: item.projectstatus === "Active" ? "Inactive" : "Active",
        }
      : item
  );
  setprojectData(updatedData);
};


  const [pri, setPri] = useState({
    empadd: "",
    empupdate: "",
    empdelete: "",
    emplist: "",
    clientadd: "",
    clientupdate: "",
    clientdelete: "",
    clientlist: "",
    projectadd: "",
    projectupdate: "",
    projectdelete: "",
    projectlist: "",
    taskadd: "",
    taskupdate: "",
    taskdelete: "",
    tasklist: "",
  });

  useEffect(() => {
  fetchPrivileges();
}, [id]);

useEffect(() => {
  const allChecked =
    projectData.length > 0 &&
    projectData.every((item) =>
      ["projectstatus", "add", "edit", "delete", "list"].every(
        (key) => item[key]?.toString().trim().toLowerCase() === "active"
      )
    );

  setMasterChecked(allChecked);
}, [projectData]);


// Use like this:
 const fetchPrivileges = async () => {
  if (!id) return;
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/privileges/getPriByid/${id}`
    );
    const res_data = await response.json();
    if (response.ok) {
      const packageData = res_data.msg?.[0] || {};
      setPri(packageData);

      const updatedData = [
        {
          id: 1,
          projectName: "Employee",
          projectstatus:
            packageData.empadd === "1" ||
            packageData.empupdate === "1" ||
            packageData.empdelete === "1" ||
            packageData.emplist === "1"
              ? "Active"
              : "Inactive",
          add: packageData.empadd === "1" ? "Active" : "Inactive",
          edit: packageData.empupdate === "1" ? "Active" : "Inactive",
          delete: packageData.empdelete === "1" ? "Active" : "Inactive",
          list: packageData.emplist === "1" ? "Active" : "Inactive",
        },
        {
          id: 2,
          projectName: "Client",
          projectstatus:
            packageData.clientadd === "1" ||
            packageData.clientupdate === "1" ||
            packageData.clientdelete === "1" ||
            packageData.clientlist === "1"
              ? "Active"
              : "Inactive",
          add: packageData.clientadd === "1" ? "Active" : "Inactive",
          edit: packageData.clientupdate === "1" ? "Active" : "Inactive",
          delete: packageData.clientdelete === "1" ? "Active" : "Inactive",
          list: packageData.clientlist === "1" ? "Active" : "Inactive",
        },
        {
          id: 3,
          projectName: "Project",
          projectstatus:
            packageData.projectadd === "1" ||
            packageData.projectupdate === "1" ||
            packageData.projectdelete === "1" ||
            packageData.projectlist === "1"
              ? "Active"
              : "Inactive",
          add: packageData.projectadd === "1" ? "Active" : "Inactive",
          edit: packageData.projectupdate === "1" ? "Active" : "Inactive",
          delete: packageData.projectdelete === "1" ? "Active" : "Inactive",
          list: packageData.projectlist === "1" ? "Active" : "Inactive",
        },
        {
          id: 4,
          projectName: "Task",
          projectstatus:
            packageData.taskadd === "1" ||
            packageData.taskupdate === "1" ||
            packageData.taskdelete === "1" ||
            packageData.tasklist === "1"
              ? "Active"
              : "Inactive",
          add: packageData.taskadd === "1" ? "Active" : "Inactive",
          edit: packageData.taskupdate === "1" ? "Active" : "Inactive",
          delete: packageData.taskdelete === "1" ? "Active" : "Inactive",
          list: packageData.tasklist === "1" ? "Active" : "Inactive",
        },
      ];

      setprojectData(updatedData);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
};


  const columns = useMemo(
    () => [
      {
        Header: "No.",
        accessor: (_row, i) => i + 1,
      },
      //  { Header: "Created Date", accessor: "createdDate" },

      {
        Header: () => (
          <div className="form-check form-check-right">
            <Input
              type="checkbox"
              className="form-check-input"
              id="master-project-checkbox"
               checked={masterChecked} // ✅ depends on state
              onChange={handleMasterCheckboxToggle}
            />
            <Label
              className="form-check-label"
              htmlFor="master-project-checkbox"
            >
              Project Name
            </Label>
          </div>
        ),
        accessor: "projectName",
        Cell: ({ value, row }) => {
          const { id, projectstatus } = row.original;

          return (
            <div className="d-flex align-items-center">
              <div className="form-check form-check-right mb-3">
                <Input
                  className="form-check-input"
                  type="checkbox"
                  id={`project-check-${id}`}
               checked={
  row.original.add === "Active" &&
  row.original.edit === "Active" &&
  row.original.delete === "Active" &&
  row.original.list === "Active"
}

                  onChange={() => handleCheckboxToggle(id)}
                />
                <Label
                  className="form-check-label"
                  htmlFor={`project-check-${id}`}
                >
                  {value}
                </Label>
              </div>
            </div>
          );
        },
      },
      {
        Header: "Add",
        accessor: "add",
        Cell: ({ row }) => {
          const isActive = row.original.add === "Active";
          return (
            <div className="form-check form-switch">
              <input
                type="checkbox"
                className="form-check-input"
                id={`switch-${row.original.id}-add`}
                checked={isActive}
                onChange={() => handleToggle(row.original.id, "add")}
              />
              <label
                className="form-check-label"
                htmlFor={`switch-${row.original.id}-add`}
              >
                {isActive ? "Active" : "Inactive"}
              </label>
            </div>
          );
        },
      },
      {
        Header: "Update",
        accessor: "edit",
        Cell: ({ row }) => {
          const isActive = row.original.edit === "Active";
          return (
            <div className="form-check form-switch">
              <input
                type="checkbox"
                className="form-check-input"
                id={`switch-${row.original.id}-edit`}
                checked={isActive}
                onChange={() => handleToggle(row.original.id, "edit")}
              />
              <label
                className="form-check-label"
                htmlFor={`switch-${row.original.id}-edit`}
              >
                {isActive ? "Active" : "Inactive"}
              </label>
            </div>
          );
        },
      },
      {
        Header: "Delete",
        accessor: "delete",
        Cell: ({ row }) => {
          const isActive = row.original.delete === "Active";
          return (
            <div className="form-check form-switch">
              <input
                type="checkbox"
                className="form-check-input"
                id={`switch-${row.original.id}-delete`}
                checked={isActive}
                onChange={() => handleToggle(row.original.id, "delete")}
              />
              <label
                className="form-check-label"
                htmlFor={`switch-${row.original.id}-delete`}
              >
                {isActive ? "Active" : "Inactive"}
              </label>
            </div>
          );
        },
      },
      {
        Header: "List",
        accessor: "list",
        Cell: ({ row }) => {
          const isActive = row.original.list === "Active";
          return (
            <div className="form-check form-switch">
              <input
                type="checkbox"
                className="form-check-input"
                id={`switch-${row.original.id}-list`}
                checked={isActive}
                onChange={() => handleToggle(row.original.id, "list")}
              />
              <label
                className="form-check-label"
                htmlFor={`switch-${row.original.id}-list`}
              >
                {isActive ? "Active" : "Inactive"}
              </label>
            </div>
          );
        },
      },
    ],
    [projectData]
  );
const updatePrivileges = async () => {
  if (!id) {
    console.error("Role ID is missing");
    return;
  }

  if (!projectData || projectData.length === 0) {
    console.error("No privileges to update");
    return;
  }

  try {
    console.log("Updating privileges for role:", id);
    console.log("Payload:", projectData);

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/privileges/setprivileges/${id}`, {
     method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    });

    if (response.ok) {
      const result = await response.json();
        toast.success("updated Successfully");
      console.log("Updated successfully:", result);
            fetchPrivileges(); // <--- call this here to reload updated privileges

      // Add success toast here
    } else {
      console.error("Failed to update privileges:", response.status);
    }
  } catch (error) {
    console.error("Error updating privileges:", error);
  }
};

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Privileges", link: "#" },
  ];
  const [modalOpen2, setModalOpen2] = useState(false);
  return (
    <Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Privileges" breadcrumbItems={breadcrumbItems} />
          <Card>
            <CardBody>
              <TableContainer
                columns={columns}
                data={projectData}
                customPageSize={10}
                isGlobalFilter={true}
                setModalOpen={setModalOpen}
              />
              <Col md={6}>
        <div className="d-flex justify-content-end">
          <Button color="primary" onClick={updatePrivileges} className="mt-">
            Update
          </Button>
        </div>
      </Col>
            </CardBody>
          </Card>
        </Container>
        {/*  Modal for Delete Confirmation */}
        <Modal isOpen={modalOpen2} toggle={() => setModalOpen1(!modalOpen2)}>
          {/* <ModalHeader className="position-absolute right-0 top-0 w-100 z-1" toggle={() => setModalOpen2(!modalOpen2)}></ModalHeader> */}
          <ModalBody className="mt-3">
            <h4 className="p-3 text-center">
              Do you really want to <br /> delete the file?
            </h4>
            <div className="d-flex justify-content-center">
              <img
                src={deleteimg}
                alt="Privilege Icon"
                width={"70%"}
                className="mb-3 m-auto"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={() => setModalOpen2(false)}>
              Delete
            </Button>
            <Button color="secondary" onClick={() => setModalOpen2(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Fragment>
  );
};

export default Privileges;
