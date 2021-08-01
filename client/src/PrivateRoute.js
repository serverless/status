import { useEffect } from "react";
import { useLocalStorage } from 'react-use';
import { Route } from 'react-router-dom';
import { Login } from "./Login";
export const PrivateRoute = ({ component, ...options }) => {
  const [storedPassword, setStoredPassword] = useLocalStorage('serverless-status', '');
  
  useEffect(() => {
  
  }, []);

 
  let FinalComponent = Login;
  // let FinalComponent = component;

  /**
   * You're logged in and setup, just use the component specified for the route
   */
  console.log('storedPassword',storedPassword)
  if (storedPassword) {
    FinalComponent = component;
  }

  return <Route {...options} component={FinalComponent} />;
};
