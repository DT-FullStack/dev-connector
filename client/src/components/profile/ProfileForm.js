import React, { Fragment, useEffect, useState } from 'react'
import { Link, useRouteMatch, withRouter } from "react-router-dom";
import PropTypes from 'prop-types'
import { connect } from "react-redux";
import { createProfile, getCurrentProfile } from '../../actions/profile';

const initialState = {
  company: '', website: '', location: '', status: '', skills: '', githubusername: '', bio: '', twitter: '', facebook: '', linkedin: '', youtube: '', instagram: ''
};


const ProfileForm = ({ createProfile, getCurrentProfile, profile: { profile, loading }, history }) => {
  const [formData, setFormData] = useState(initialState);
  const [displaySocial, toggleSocial] = useState(false);

  const { company, website, location, status, skills, githubusername, bio, twitter, facebook, linkedin, youtube, instagram } = formData;

  const creatingProfile = useRouteMatch('/create-profile');

  useEffect(() => {
    if (!profile) getCurrentProfile();
    if (!loading && profile) {
      const profileData = { ...initialState };
      for (const key in profile) {
        if (key in profileData) profileData[key] = profile[key];
      }
      for (const key in profile.social) {
        if (key in profileData) profileData[key] = profile.social[key];
      }
      if (Array.isArray(profileData.skills))
        profileData.skills = profileData.skills.join(', ');
      setFormData(profileData);
    }
  }, [loading, getCurrentProfile, profile]);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async e => {
    e.preventDefault();
    createProfile(formData, history, !creatingProfile);
    console.log("SUBMIT", formData);
  }


  return (
    <div className='container'>
      <h1 className="large text-primary">
        {creatingProfile ? 'Create Your Profile' : 'Edit Your Profile'}
      </h1>
      <p className="lead">
        <i className="fas fa-user"></i> Let's get some information to make your
        profile stand out
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <small className="form-text">Occupation</small>
          <input type='text' placeholder='Occupation' name='status' value={status} onChange={onChange} />
        </div>
        <div className="form-group">
          <small className="form-text">Company</small>
          <input type="text" placeholder="Company" name="company" value={company} onChange={onChange} />
        </div>
        <div className="form-group">
          <small className="form-text">Website</small>
          <input type="text" placeholder="Website" name="website" value={website} onChange={onChange} />
        </div>
        <div className="form-group">
          <small className="form-text">Location (eg. Boston, MA)</small>
          <input type="text" placeholder="Location" name="location" value={location} onChange={onChange} />
        </div>
        <div className="form-group">
          <small className="form-text">Skills (comma separated)</small>
          <input type="text" placeholder="* Skills" name="skills" value={skills} onChange={onChange} />
        </div>
        <div className="form-group">
          <small className="form-text">GitHub Username</small>
          <input
            type="text"
            placeholder="Github Username"
            name="githubusername" value={githubusername} onChange={onChange}
          />
        </div>
        <div className="form-group">
          <small className="form-text">Bio</small>
          <textarea placeholder="A short bio of yourself" name="bio" value={bio} onChange={onChange}></textarea>
        </div>

        <div className="my-2">
          <button onClick={() => toggleSocial(!displaySocial)} type="button" className="btn btn-light">
            Add Social Network Links
          </button>
          <span>Optional</span>
        </div>

        {displaySocial === false ? null
          : (
            <Fragment>
              <div className="form-group social-input">
                <i className="fab fa-twitter fa-2x"></i>
                <input type="text" placeholder="Twitter URL" name="twitter" value={twitter} onChange={onChange} />
              </div>

              <div className="form-group social-input">
                <i className="fab fa-facebook fa-2x"></i>
                <input type="text" placeholder="Facebook URL" name="facebook" value={facebook} onChange={onChange} />
              </div>

              <div className="form-group social-input">
                <i className="fab fa-youtube fa-2x"></i>
                <input type="text" placeholder="YouTube URL" name="youtube" value={youtube} onChange={onChange} />
              </div>

              <div className="form-group social-input">
                <i className="fab fa-linkedin fa-2x"></i>
                <input type="text" placeholder="Linkedin URL" name="linkedin" value={linkedin} onChange={onChange} />
              </div>

              <div className="form-group social-input">
                <i className="fab fa-instagram fa-2x"></i>
                <input type="text" placeholder="Instagram URL" name="instagram" value={instagram} onChange={onChange} />
              </div>

            </Fragment>
          )}
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
      </form>

    </div>
  )
}

ProfileForm.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  profile: state.profile
})

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(withRouter(ProfileForm))
