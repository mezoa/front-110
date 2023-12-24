import React from 'react'
import useRegisterForm from '../../hooks/useRegisterForm'
import { useNavigate } from 'react-router-dom'
import logo from './../../assets/img/Budget Flow.svg'

const Register = () => {
    const { values, handleChange, handleSubmit } = useRegisterForm({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const submitForm = async (event) => {
      event.preventDefault();
      const data = await handleSubmit(values);
      if (data) {
          navigate('/login'); // Redirect to login page after successful registration
      }
  }

  const handleButtonClick = () => {
    navigate('/'); // Navigate to home page
  };
  
  return (
    <div className="container">
      <div className="row justify-content-center align-items-center vh-100">
        <div className="col-md-6 col-sm-8">
          <div className="alert alert-danger color-info shadow">
            login error
          </div>
          <div onSubmit={handleSubmit} className="card pt-4">
            <div className="card-body">
              <div className="text-center mb-5">
                <button className="close-button" onClick={handleButtonClick}>x</button>
                <img src={logo} className='img-fluid mb-4'/>
                <h3>Register</h3>
                <p>Please fill the form to Register</p>
              </div>
              <form action="#">
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <div className="text-danger my-1">please input a value</div>
                        <input type="text" id="name" className="form-control" name="name"
                           required value={values.name} onChange={handleChange}
                        />
                        </div>
                    </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <div className="text-danger my-1">Email already exist</div>
                      <input type="email" id="email" className="form-control" name="email"
                        value={values.email} onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <div className="text-danger my-1">Invalid Password</div>
                      <input type="password" id="password" className="form-control" name="password"
                        value={values.password} onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="clearfix">
                  <button className="btn btn-primary" type="submit">Sign In</button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register