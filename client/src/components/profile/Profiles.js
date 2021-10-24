import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from "react-redux";
import { getProfiles } from '../../actions/profile';
import ProfileCard from "./ProfileCard";

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  useEffect(() => {
    getProfiles()
  }, [getProfiles])

  const renderProfiles = () => profiles.map(p => <ProfileCard key={p._id} profile={p} />)

  return (
    <Fragment>
      <div>Profiles</div>
      {renderProfiles()}
    </Fragment>
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
