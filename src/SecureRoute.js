import React from "react";
import { Redirect, Route } from "react-router-dom";

function SecureRoute({ children, ...rest }) {
    const isAuthenticated = localStorage.getItem("name");
    return (
        <Route {...rest} render={() => isAuthenticated ? ( children ) : ( <Redirect to="/join" /> ) } />
    );
}

export default SecureRoute;