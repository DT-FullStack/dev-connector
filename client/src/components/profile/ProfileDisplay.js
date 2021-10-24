import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getProfileByUserId } from '../../actions/profile';
import ProfileTop from './sections/ProfileTop';
import ProfileAbout from './sections/ProfileAbout';
import ProfileExperience from './sections/ProfileExperience';
import ProfileEducation from './sections/ProfileEducation';
import ProfileGithub from './sections/ProfileGithub';

const ProfileDisplay = ({ profile: { profile, loading }, auth, match, getProfileByUserId }) => {
  useEffect(() => {
    getProfileByUserId(match.params.id)
  }, [getProfileByUserId, match])
  if (loading || !profile) return null;

  return (
    <Fragment>
      <Link to="/profiles" className="btn btn-light">
        Back To Profiles
      </Link>
      {auth.isAuthenticated &&
        auth.loading === false &&
        auth.user._id === profile.user._id && (
          <Link to="/edit-profile" className="btn btn-dark">
            Edit Profile
          </Link>
        )}
      <div className="profile-grid my-1">
        <ProfileTop profile={profile} />
        <ProfileAbout profile={profile} />
        <div className="profile-exp bg-white p-2">
          <h2 className="text-primary">Experience</h2>
          {profile.experience.length > 0 ? (
            <Fragment>
              {profile.experience.map((experience) => (
                <ProfileExperience
                  key={experience._id}
                  experience={experience}
                />
              ))}
            </Fragment>
          ) : (
            <h4>No experience credentials</h4>
          )}
        </div>

        <div className="profile-edu bg-white p-2">
          <h2 className="text-primary">Education</h2>
          {profile.education.length > 0 ? (
            <Fragment>
              {profile.education.map((education) => (
                <ProfileEducation
                  key={education._id}
                  education={education}
                />
              ))}
            </Fragment>
          ) : (
            <h4>No education credentials</h4>
          )}
        </div>

        {profile.githubusername && (
          <ProfileGithub username={profile.githubusername} />
        )}
      </div>
    </Fragment>
  )
}

ProfileDisplay.propTypes = {
  profile: PropTypes.object.isRequired,
  getProfileByUserId: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
})

export default connect(mapStateToProps, { getProfileByUserId })(ProfileDisplay)
