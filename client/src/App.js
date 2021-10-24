import { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import Landing from './components/layout/Landing';
import NavBar from './components/layout/NavBar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';
import PrivateRoute from './components/routing/PrivateRoute';
/**
 * REDUX
 */
import { Provider } from "react-redux";
import store from './store';
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
import Dashboard from './components/dashboard/Dashboard';
import ProfileForm from './components/profile/ProfileForm';
import ExperienceForm from './components/profile/ExperienceForm';
import EducationForm from './components/profile/EducationForm';
import Profiles from './components/profile/Profiles';
import ProfileDisplay from './components/profile/ProfileDisplay';
import Posts from './components/posts/Posts';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser(), []);
  });

  /** 
   * Just an interesting note.... the two routes `/create-profile` and `/edit-profile` are literally the same exact shit.
   * They are two different routes that load the same page
   * If the user has a profile... either route would allow editing.  
   * The only difference is text that is displayed.
   */
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <NavBar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/profiles" component={Profiles} />
              <Route exact path="/profile/:id" component={ProfileDisplay} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/create-profile" component={ProfileForm} />
              <PrivateRoute exact path="/edit-profile" component={ProfileForm} />
              <PrivateRoute exact path="/add-experience" component={ExperienceForm} />
              <PrivateRoute exact path="/add-education" component={EducationForm} />
              <PrivateRoute exact path="/posts" component={Posts} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
