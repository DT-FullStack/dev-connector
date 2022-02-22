import React from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Landing = ({ isAuthenticated }) => {
  const packages = {
    "Front End": 'React JS, React Router, Axios',
    "Back End": "Node, Express, Express Validator",
    "Database": "MongoDB, Mongoose",
    "Security": "BCrypt Js, Json Web Token, Config",
    "State Management": 'Redux, React-Redux, Redux-Thunk',
    "Misc Packages": 'Moment, UUID, Gravatar, Redux DevTools',
  }

  const addLabelEmphasis = ({ target }) => { target.classList.add('hover'); target.classList.add('red'); }
  const removeLabelEmphasis = ({ target }) => { target.classList.remove('hover'); target.classList.remove('red'); }


  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Definitely Not LinkedIn</h1>
          <p className="lead">
            Simple mock-up of a Networking App
          </p>
          {!isAuthenticated && (
            <div className="buttons">
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
              <Link to="/login" className="btn btn-light">Login</Link>
            </div>
          )}
          <div className="flex stretch section">
            <div>
              <h2 className='text-primary'>Simple Auth</h2>
              <p>The most basic level of authentication, verifying a user from a database and issuing a cookie</p>
            </div>
            <div>
              <h2 className='text-primary'>Discussion</h2>
              <p>Collect and store user info</p>
              <p>Show collection of user profiles</p>
              <p>Users can post, comment, and like</p>
            </div>
            <div>
              <h2 className='text-primary'>MERN Stack</h2>
              <p>Allows for fully customizable functionality for both browser and server.</p>
            </div>
          </div>
          <hr style={{ width: '100%', border: '1px solid white' }} />
          <div className="section">
            <div className="flex label">
              {
                Object.keys(packages).map(key => (
                  <div key={key} className="" onMouseEnter={addLabelEmphasis} onMouseLeave={removeLabelEmphasis}>
                    <div>{key}</div>
                    <div className="">{packages[key]}</div>
                  </div>
                ))
              }
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

Landing.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Landing);
