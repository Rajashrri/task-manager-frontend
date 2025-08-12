import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Input,
  Container,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Select from "react-select";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const UpdateEmploye = () => {
  const { id } = useParams(); // ✅ Allowed in functional component

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    role_id: "",
  role_name: "",
    emp_id: "",
  });
  const [optionscat, setOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [breadcrumbItems] = useState([
    { title: "Dashboard", link: "/" },
    { title: "Update Employee", link: "#" },
  ]);

  // Fetch existing employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/employee/getemployeeByid/${id}`
        );
        const res_data = await response.json();

        if (response.ok) {
          const packageData = res_data.msg;
          setEmployee({
            name: packageData.name || "",
            email: packageData.email || "",
            role_id: packageData.role_id || "",
             role_name: packageData.role_name || "",
            emp_id: packageData.emp_id || "",
          });
        } else {
          toast.error("Employee not found");
        }
      } catch (error) {
        console.error("Fetch employee error:", error);
      }
    };

    fetchEmployee();
    fetchOptions();
  }, [id]);

  const fetchOptions = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/employee/categoryOptions`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const res_data = await response.json();
      const options = Array.isArray(res_data.msg)
        ? res_data.msg.map((item) => ({
             value: item._id, // ✅ Use the role's ID from DB
            label: item.name?.trim() || item.name,
          }))
        : [];

        
      setOptions(options);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  // Update submission

  const handleinput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setEmployee({
      ...employee,
      [name]: value,
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!employee.name) newErrors.name = "Name is required";
    if (!employee.email) newErrors.email = "Email is required";
    if (!employee.role_id) newErrors.role_id = "Role is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {


       const requestBody = {
      name: employee.name,
      email: employee.email,
      emp_id: employee.emp_id,
      role_id: employee.role_id,
      role_name: employee.role_name, // ✅ send both
    };
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/employee/updateemployee/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
           body: JSON.stringify(requestBody),
        }
      );

      const res_data = await response.json();
      if (!response.ok) {
        if (res_data.msg === "Email already exist") {
          setErrors({ email: res_data.msg });
        } else {
          toast.error(res_data.msg || "Something went wrong.");
        }
        return;
      }

      toast.success("Employee updated successfully");
    } catch (error) {
      console.log("Update error:", error);
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title="UPDATE EMPLOYEE"
          breadcrumbItems={breadcrumbItems}
        />
        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <form
                  className="needs-validation"
                  onSubmit={handleUpdateSubmit}
                >
                  <Row>
                    <Col md="6">
                      <div className="mb-3">
                        <Label
                          className="form-label"
                          htmlFor="validationCustom01"
                        >
                          Employee Id (eg.DHEMP0 your code)
                        </Label>
                        <Input
                          value={employee.emp_id || ""}
                          onChange={handleinput}
                          name="emp_id"
                          placeholder="Employee Code"
                          type="text"
                          className="form-control"
                          id="validationCustom01"
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <Label>First name</Label>
                      <Input
                        name="name"
                        placeholder="Name"
                        type="text"
                        value={employee.name}
                        onChange={handleinput}
                      />
                      {errors.name && (
                        <div className="text-danger">{errors.name}</div>
                      )}
                    </Col>

                    <Col md="6">
                      <Label>Email</Label>
                      <Input
                        name="email"
                        placeholder="Email"
                        type="email"
                        value={employee.email}
                        onChange={handleinput}
                      />
                      {errors.email && (
                        <div className="text-danger">{errors.email}</div>
                      )}
                    </Col>

                    <Col md="6">
                      <Label>Select Role</Label>
                      <Select
                       options={optionscat}
                       name="role_id"
                       value={
                         optionscat.find(
                           (option) => option.value === employee.role_id
                         ) || null
                       }
                       onChange={(selectedOption) => {
                         setEmployee((prev) => ({
                           ...prev,
                           role_id: selectedOption ? selectedOption.value : "",
                           role_name: selectedOption ? selectedOption.label : "",
                         }));
                       }}
                       isClearable
                       placeholder="Choose..."
                     />
                     {errors.role && (
                       <span className="text-danger">{errors.role_id}</span>
                     )}
                    </Col>
                  </Row>

                  <Button color="primary" type="submit" className="mt-3">
                    Update
                  </Button>
                </form>
              </CardBody>


              
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UpdateEmploye;
