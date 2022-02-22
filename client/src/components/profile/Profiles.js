import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from "react-redux";
import { getProfiles } from '../../actions/profile';
import ProfileCard from "./ProfileCard";

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  useEffect(() => {
    getProfiles()
  }, [getProfiles])

  const renderProfiles = () => {
    return loading ? <div>Loading...</div>
      : profiles.length === 0 ? <div>No Users</div>
        : profiles.map(p => <ProfileCard key={p._id} profile={p} />)
  }

  return (
    <div className='container'>
      <h1 className='large text-primary'>Users</h1>
      <p className='lead'>
        <i className='fab fa-connectdevelop' /> Browse and connect with other users
      </p>
      {renderProfiles()}
    </div>
  )
}

Profiles.propTypes = {
  profile: PropTypes.object.isRequired,
  getProfiles: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  profile: state.profile
})

export default connect(mapStateToProps, { getProfiles })(Profiles)
