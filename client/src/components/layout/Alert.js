import React from 'react'
import PropTypes from 'prop-types'
import { connect } from "react-redux";

/**
 * Don't forget to include `key` attr when mapping `actions to jsx`
 */
const Alert = ({ alerts }) => alerts !== null && alerts.length > 0 && alerts.map((alert, a) => (
  <div key={alert.id} className={`alert alert-${alert.alertType} alert-${a}`}>
    {alert.msg}
  </div>
))

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
}

/**
 * 
 * @param {*} state 
 * @returns {object} {[key:propName]: state.path}
 */
const mapStateToProps = state => ({
  alerts: state.alert
})

export default connect(mapStateToProps)(Alert)
