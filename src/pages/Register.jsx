import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Register() {
  const [showPassword, setShowPassword] = useState(false);

 const [formData, setFormData] = useState({
  role: "employee",

  fullName: "",
  email: "",
  phone: "",

  employeeId: "",
  department: "",
  designation: "",

  adminCode: "",
  companySize: "",
  industry: "",

  password: "",
  confirmPassword: "",
});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    if (data.success) {
      alert("Registration Successful");

      localStorage.setItem("token", data.token);

      console.log(data.user);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
};

  return (
    <>
     <style>{`
*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

.register-page{
  min-height:100vh;
  background:#f8fafc;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:40px 15px;
}

.register-card{
  width:100%;
  max-width:1150px;
  background:#fff;
  border-radius:24px;
  overflow:hidden;
  box-shadow:0 15px 45px rgba(23,67,111,.12);
  animation:fadeUp .8s ease;
}

@keyframes fadeUp{
  from{
    opacity:0;
    transform:translateY(40px);
  }
  to{
    opacity:1;
    transform:translateY(0);
  }
}

.left-section{
  background:linear-gradient(
    135deg,
    #17436f,
    #6fb653
  );
  color:#fff;
  height:100%;
  padding:60px 40px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  position:relative;
  overflow:hidden;
}

.left-section::before{
  content:"";
  position:absolute;
  width:220px;
  height:220px;
  border-radius:50%;
  background:rgba(255,255,255,.08);
  top:-80px;
  right:-80px;
}

.left-section::after{
  content:"";
  position:absolute;
  width:140px;
  height:140px;
  border-radius:50%;
  background:rgba(255,255,255,.06);
  bottom:-30px;
  left:-30px;
}

.company-badge{
  display:inline-block;
  width:max-content;
  padding:8px 18px;
  border-radius:30px;
  background:rgba(255,255,255,.15);
  margin-bottom:20px;
  font-size:13px;
  font-weight:600;
  letter-spacing:1px;
}

.left-section h1{
  font-size:3rem;
  font-weight:800;
  margin-bottom:20px;
}

.left-section p{
  line-height:1.8;
  opacity:.95;
}

.feature-list{
  margin-top:30px;
}

.feature-list div{
  margin-bottom:12px;
  font-size:15px;
}

.right-section{
  padding:40px;
  background:#fff;
}

.form-title{
  color:#17436f;
  font-size:2rem;
  font-weight:700;
  margin-bottom:25px;
}

.form-floating{
  margin-bottom:18px;
}

.form-control,
.form-select{
  min-height:58px;
  border-radius:12px;
  border:1px solid #dbe4ee;
  transition:.3s;
}

.form-control:focus,
.form-select:focus{
  border-color:#6fb653;
  box-shadow:0 0 0 4px rgba(111,182,83,.15);
}

.form-select{
  cursor:pointer;
}

.password-wrapper{
  position:relative;
}

.show-btn{
  position:absolute;
  right:15px;
  top:50%;
  transform:translateY(-50%);
  border:none;
  background:none;
  color:#17436f;
  font-weight:600;
  cursor:pointer;
  z-index:10;
}

.employee-box,
.admin-box{
  background:#f8fbff;
  border-left:5px solid #6fb653;
  padding:20px;
  border-radius:15px;
  margin-bottom:20px;
  animation:slideDown .4s ease;
}

.section-title{
  color:#17436f;
  font-size:18px;
  font-weight:700;
  margin-bottom:15px;
}

@keyframes slideDown{
  from{
    opacity:0;
    transform:translateY(-10px);
  }
  to{
    opacity:1;
    transform:translateY(0);
  }
}

.register-btn{
  width:100%;
  border:none;
  border-radius:12px;
  padding:14px;
  font-size:16px;
  font-weight:700;
  color:#fff;
  background:linear-gradient(
    135deg,
    #17436f,
    #6fb653
  );
  transition:.3s;
}

.register-btn:hover{
  transform:translateY(-3px);
  box-shadow:0 12px 25px rgba(23,67,111,.25);
}

.login-link{
  text-align:center;
  margin-top:20px;
}

.login-link a{
  color:#6fb653;
  text-decoration:none;
  font-weight:600;
}

.login-link a:hover{
  color:#17436f;
}

.role-badge{
  display:inline-block;
  background:#e8f5e9;
  color:#17436f;
  padding:6px 15px;
  border-radius:20px;
  font-size:12px;
  font-weight:600;
  margin-bottom:15px;
}

@media(max-width:992px){

  .left-section h1{
    font-size:2.3rem;
  }

  .right-section{
    padding:30px;
  }
}

@media(max-width:768px){

  .left-section{
    display:none;
  }

  .right-section{
    padding:25px;
  }

  .form-title{
    text-align:center;
    font-size:1.8rem;
  }

  .register-card{
    border-radius:18px;
  }
}
`}</style>

      <div className="register-page">
        <div className="register-card">
          <div className="row g-0">

            <div className="col-md-5">
              <div className="left-section">

                <div className="company-badge">
                  COMPANY REGISTRATION
                </div>

                <h1>Welcome</h1>

                <p>
                  Create your company account and start managing
                  employees, projects, services, and clients from a
                  single platform.
                </p>

                <div className="feature-list">
                  <div>✓ Easy Registration</div>
                  <div>✓ Secure Platform</div>
                  <div>✓ Business Management</div>
                  <div>✓ Employee Tracking</div>
                </div>

              </div>
            </div>

            <div className="col-md-7">
              <div className="right-section">

                <h2 className="form-title">
                  Create Account
                </h2>

               <form onSubmit={handleSubmit}>

  {/* Role Selection */}
  <div className="form-floating mb-3">
    <select
      className="form-select"
      name="role"
      value={formData.role}
      onChange={handleChange}
    >
      <option value="employee">Employee</option>
      <option value="admin">Admin</option>
    </select>
    <label>Select Role</label>
  </div>

  <div className="row">
    <div className="col-md-6">
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <label>Full Name</label>
      </div>
    </div>

    <div className="col-md-6">
      <div className="form-floating">
        <input
          type="email"
          className="form-control"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label>Email Address</label>
      </div>
    </div>
  </div>

  <div className="form-floating mt-3">
    <input
      type="tel"
      className="form-control"
      name="phone"
      placeholder="Phone"
      value={formData.phone}
      onChange={handleChange}
      required
    />
    <label>Phone Number</label>
  </div>

  {/* Employee Fields */}
  {formData.role === "employee" && (
    <div className="employee-box mt-3">

      <h5 className="section-title">
        Employee Information
      </h5>

      <div className="form-floating mb-3">
        <input
          type="text"
          className="form-control"
          name="employeeId"
          placeholder="Employee ID"
          value={formData.employeeId}
          onChange={handleChange}
        />
        <label>Employee ID</label>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
            />
            <label>Department</label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              name="designation"
              placeholder="Designation"
              value={formData.designation}
              onChange={handleChange}
            />
            <label>Designation</label>
          </div>
        </div>
      </div>

    </div>
  )}

  {/* Admin Fields */}
  {formData.role === "admin" && (
    <div className="admin-box mt-3">

      <h5 className="section-title">
        Admin Information
      </h5>

      <div className="form-floating mb-3">
        <input
          type="text"
          className="form-control"
          name="adminCode"
          placeholder="Admin Code"
          value={formData.adminCode}
          onChange={handleChange}
        />
        <label>Admin Code</label>
      </div>

      <div className="form-floating mb-3">
        <select
          className="form-select"
          name="companySize"
          value={formData.companySize}
          onChange={handleChange}
        >
          <option value="">Select Team Size</option>
          <option>1 - 10 Employees</option>
          <option>11 - 50 Employees</option>
          <option>51 - 100 Employees</option>
          <option>100+ Employees</option>
        </select>
        <label>Team Size</label>
      </div>

      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          name="industry"
          placeholder="Industry"
          value={formData.industry}
          onChange={handleChange}
        />
        <label>Industry Type</label>
      </div>

    </div>
  )}

  {/* Password */}
  <div className="password-wrapper mt-3">
    <div className="form-floating">
      <input
        type={showPassword ? "text" : "password"}
        className="form-control"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <label>Password</label>
    </div>

    <button
      type="button"
      className="show-btn"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? "Hide" : "Show"}
    </button>
  </div>

  {/* Confirm Password */}
  <div className="form-floating mt-3">
    <input
      type={showPassword ? "text" : "password"}
      className="form-control"
      name="confirmPassword"
      placeholder="Confirm Password"
      value={formData.confirmPassword}
      onChange={handleChange}
      required
    />
    <label>Confirm Password</label>
  </div>

  <button
    type="submit"
    className="register-btn mt-4"
  >
    Create Account
  </button>

  <div className="login-link">
    Already have an account?{" "}
    <a href="/login">Login</a>
  </div>

</form>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Register;