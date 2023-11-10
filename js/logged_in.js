import {clearItem, doesItemExist, STUDY_ID_FIELD, USER_ID_FIELD} from "./utils/storage.js";

auth0.createAuth0Client({
    domain: "dev-bob0zt3qosukwaoi.us.auth0.com",
    clientId: "33DVyyXx90bsLdPjVhP4szxvHBkUwyka",
}).then(async (auth0Client) => {
    const logout = () => {
        // Clear item
        clearItem(USER_ID_FIELD);
        clearItem(STUDY_ID_FIELD);

        // Log out of Auth0
        auth0Client.logout({
            logoutParams: {
                returnTo: window.location.origin + '/login-student.html'
            }
        });
    }

    // Attach to a button with id "logout" in the DOM
    const logoutButton = document.getElementById("logout");
    logoutButton.addEventListener("click", (e) => {
        e.preventDefault();
        logout();
    });

    // Redirect user if they aren't logged in
    if (!doesItemExist(USER_ID_FIELD) || !(await auth0Client.isAuthenticated())) {
        logout();
    }
});
