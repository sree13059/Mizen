import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest, authStorage } from "../api";

const ADMIN_USERNAME = "Mizentechsolutions";
const ADMIN_PASSWORD = "Mizen123";
const ADMIN_EMAIL = "Mizentechsolutions@gmail.com";

const bootstrapAdmin = async () => {
  const data = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      role: "admin",
      fullName: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      phone: "+91 94809 49103",
      adminCode: "MIZEN-ADMIN",
      companySize: "100+ Employees",
      industry: "Technology Services",
      password: ADMIN_PASSWORD,
      confirmPassword: ADMIN_PASSWORD,
    }),
  });

  return data;
};

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    role: "employee",
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const isFixedAdminLogin =
        form.username.trim().toLowerCase() === ADMIN_USERNAME.toLowerCase() &&
        form.password === ADMIN_PASSWORD;
      const loginPayload = {
        ...form,
        username: form.username.trim(),
        role: isFixedAdminLogin ? "admin" : form.role,
      };

      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(loginPayload),
      });

      authStorage.setSession(data.token, data.user);
      navigate(data.user.role === "admin" ? "/admin" : "/employee");
    } catch (err) {
      const isFixedAdminLogin =
        form.username.trim().toLowerCase() === ADMIN_USERNAME.toLowerCase() &&
        form.password === ADMIN_PASSWORD;

      if (isFixedAdminLogin) {
        try {
          const data = await bootstrapAdmin();
          authStorage.setSession(data.token, data.user);
          navigate("/admin");
          return;
        } catch {
          authStorage.clearSession();
        }
      }

      setError(err.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .login-page{
          min-height:100vh;
          background:linear-gradient(135deg, rgba(23,67,111,.06), rgba(111,182,83,.08)), #ffffff;
          display:flex;
          justify-content:center;
          align-items:center;
          padding:42px 18px;
        }

        .login-card{
          width:100%;
          max-width:1060px;
          background:#fff;
          border-radius:24px;
          overflow:hidden;
          box-shadow:0 24px 70px rgba(23,67,111,.14);
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

        .login-left{
          background:linear-gradient(
            135deg,
            #17436f,
            #6fb653
          );
          color:#fff;
          padding:70px 44px;
          height:100%;
          display:flex;
          flex-direction:column;
          justify-content:center;
          position:relative;
          overflow:hidden;
        }

        .login-left::before{
          content:"";
          position:absolute;
          width:180px;
          height:180px;
          border-radius:50%;
          background:rgba(255,255,255,.1);
          top:-60px;
          right:-60px;
        }

        .login-left::after{
          content:"";
          position:absolute;
          width:120px;
          height:120px;
          border-radius:50%;
          background:rgba(255,255,255,.08);
          left:-20px;
          bottom:-20px;
        }

        .login-badge{
          display:inline-block;
          width:max-content;
          padding:8px 18px;
          border-radius:30px;
          background:rgba(255,255,255,.2);
          margin-bottom:20px;
          font-size:13px;
          font-weight:600;
        }

        .login-left h1{
          font-size:clamp(2.4rem, 5vw, 3.5rem);
          font-weight:900;
          line-height:1;
          margin-bottom:20px;
        }

        .login-left p{
          line-height:1.8;
        }

        .login-right{
          padding:58px 52px;
          background:#fff;
        }

        .form-title{
          color:#17436f;
          font-size:2rem;
          font-weight:700;
          margin-bottom:30px;
        }

        .login-form{
          display:grid;
          gap:20px;
        }

        .login-field{
          display:grid;
          gap:8px;
        }

        .login-field{
          margin-bottom:20px;
        }

        .login-field label{
          display:block;
          font-weight:600;
          color:#17436f;
        }

        .login-field input,
        .login-field select{
          width:100%;
          height:55px;
          border:1px solid #dbe4ee;
          border-radius:12px;
          padding:0 15px;
          transition:.3s;
          background:#fff;
          color:#17436f;
        }

        .login-role-pill{
          align-items:center;
          background:linear-gradient(135deg, #f4faf2, #eef7ff);
          border:1px solid #dbe4ee;
          border-radius:12px;
          color:#17436f;
          display:flex;
          font-weight:700;
          height:55px;
          padding:0 15px;
        }

        .login-field input:focus,
        .login-field select:focus{
          outline:none;
          border-color:#6fb653;
          box-shadow:0 0 0 4px rgba(111,182,83,.15);
        }

        .password-wrapper{
          position:relative;
        }

        .show-btn{
          position:absolute;
          right:15px;
          top:42px;
          background:none;
          border:none;
          color:#17436f;
          font-weight:600;
          cursor:pointer;
        }

        .login-btn{
          width:100%;
          border:none;
          padding:14px;
          border-radius:12px;
          color:white;
          font-weight:700;
          font-size:16px;
          background:linear-gradient(
            135deg,
            #17436f,
            #6fb653
          );
          transition:.3s;
        }

        .login-btn:hover{
          transform:translateY(-3px);
          box-shadow:0 12px 25px rgba(23,67,111,.25);
        }

        .login-btn:disabled{
          cursor:not-allowed;
          opacity:.72;
          transform:none;
        }

        .auth-error{
          color:#dc3545;
          margin-bottom:15px;
          font-weight:600;
        }

        .register-link{
          text-align:center;
          margin-top:20px;
        }

        .register-link a{
          color:#6fb653;
          text-decoration:none;
          font-weight:600;
        }

        .register-link a:hover{
          color:#17436f;
        }

        @media(max-width:768px){

          .login-left{
            display:none;
          }

          .login-right{
            padding:25px;
          }

          .form-title{
            text-align:center;
          }
        }
      `}</style>

      <div className="login-page">
        <div className="login-card">
          <div className="row g-0">

            <div className="col-md-5">
              <div className="login-left">

                <div className="login-badge">
                  PORTAL LOGIN
                </div>

                <h1>Welcome Back</h1>

                <p>
                  Access your dashboard securely and manage users,
                  services, reports and business operations from
                  one centralized platform.
                </p>

              </div>
            </div>

          <div className="col-md-7">
              <div className="login-right">

                <h2 className="form-title">
                  Sign In
                </h2>

                <form className="login-form" onSubmit={handleSubmit}>

                  <div className="login-field">
                    <label>Login As</label>
                    <select name="role" value={form.role} onChange={handleChange}>
                      <option value="employee">Employee</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="login-field">
                    <label>Username</label>
                    <input
                      type="text"
                      name="username"
                      placeholder="Email, employee ID, or name"
                      value={form.username}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="password-wrapper">
                    <div className="login-field">
                      <label>Password</label>
                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        name="password"
                        placeholder="Enter Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <button
                      type="button"
                      className="show-btn"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword
                        ? "Hide"
                        : "Show"}
                    </button>
                  </div>

                  {error && (
                    <p className="auth-error">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="login-btn"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>

                  <div className="register-link">
                    New User?{" "}
                    <Link to="/register">
                      Create Account
                    </Link>
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

export default Login;
