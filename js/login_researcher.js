import {clearItem, setItem, STUDY_ID_FIELD, USER_ID_FIELD} from "./utils/storage.js";
import {doesUserExists, signupUser} from "./utils/db.js";
import {toggleButtonLoading} from "./utils/form.js";

const loginDiv = document.getElementById("login-step");
const signupDiv = document.getElementById("complete-signup");
let user = null;

const login = () => {
    setItem(USER_ID_FIELD, user.sub);
    clearItem(STUDY_ID_FIELD);
    window.location = "index-researcher.html"
}

const completeSignupButton = document.getElementById("signup");
completeSignupButton.addEventListener("click", async () => {
    toggleButtonLoading("signup");

    const firstName = document.getElementById("fn").value.trim();
    const lastName = document.getElementById("ln").value.trim();

    // Enforce that we get both first and last name
    if (firstName.length === 0 || lastName.length === 0) {
        alert("Please provide both your first and last name!");
    } else {
        const signUpSuccessful = await signupUser(user.sub, user.email, firstName, lastName);
        if (!signUpSuccessful) {
            alert("The sign up failed, please try again.");
        } else {
            login();
        }
    }

    toggleButtonLoading("signup");
})

auth0.createAuth0Client({
    domain: "dev-bob0zt3qosukwaoi.us.auth0.com",
    clientId: "33DVyyXx90bsLdPjVhP4szxvHBkUwyka",
}).then(async (auth0Client) => {
    // Attach to a button with id "login" in the DOM
    const loginButton = document.getElementById("login");
    loginButton.addEventListener("click", async (e) => {
        e.preventDefault();
        toggleButtonLoading("login");

        try {
            await auth0Client.loginWithPopup();

            if (await auth0Client.isAuthenticated()) {
                user = await auth0Client.getUser();

                // See if user has signed up already
                if (await doesUserExists(user.sub)) {
                    login();
                } else {
                    // Show signupDiv
                    loginDiv.style.display = "none";
                    signupDiv.style.display = "block";
                }
            }
        } catch (e) {
            if (e instanceof auth0.PopupTimeoutError) {
                // custom logic to inform user to retry
                e.popup.close();
            }
        }

        toggleButtonLoading("login");
    });
});
