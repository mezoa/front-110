import React, {useState} from 'react'
import useLogin from '../../hooks/useLogin'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'; 
import logo from './../../assets/img/Budget Flow.svg'


const Login = () => {
  const { login, loading, error } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const validatePassword = (password) => {
    return password.length >= 8;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    const data = await login(email, password);
    if (data) {
      navigate('/dashboard'); // Redirect to home page
    }
  };

  const handleButtonClick = () => {
    navigate('/'); // Navigate to home page
  };


  return (
    <div className="container">
      <div className="row justify-content-center align-items-center vh-100">
        <div className="col-md-6 col-sm-8">
          <div className="text-danger color-info shadow">
          {error ? error.message : ''}
          </div>
          <div className="card pt-4">
            <div className="card-body">
              <div className="text-center mb-5">
              <button className="close-button" onClick={handleButtonClick}>x</button>
              <img src={logo} className='img-fluid mb-4'/> {/* Use the imported image */}
                <h3>Login</h3>
                <p>Please fill the form to login</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <div className="text-danger my-1">{emailError}</div>
                      <input type="email" id="email" className="form-control" name="email"
                        value={email} onChange={e => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <div className="text-danger my-1">{passwordError}</div>
                      <input type="password" id="password" className="form-control" name="password"
                        value={password} onChange={e => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="clearfix">
                <button className="btn btn-primary mt-4 sign-button">Sign In</button>
                </div>
              </form>
              <div className="mt-4">
                <Link to="/register">Don't have an account? Sign Up</Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login