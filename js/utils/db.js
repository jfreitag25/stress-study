const UsersAPIKey = "h3BUx4gyjgxHR0H4"; // Update key as needed
const StudiesAPIKey = "kRoqVhKOVuV6LF4x"; // Update key as needed
const urlUsers = "https://api.apispreadsheets.com/data/Wq0906nh4QTFcDhm/"; // Update URL as needed
const urlStudies = "https://api.apispreadsheets.com/data/yXkXPcvTiuFORrDW/"; // Update URL as needed

//TODO: Studies url broken

/**
 * Check if a user with the given id exists
 */
export async function doesUserExists(id) {
    const res = await fetch(`${urlUsers}?query=
        select User_ID from ${UsersAPIKey} where User_ID='${id}'`);
    if (res.ok) {
        const dataUser = await res.json();
        return dataUser.data.length > 0;
    }
    return false;
}

/**
 * Check if a study with the given id exists
 */
export async function doesStudyExist(id) {
    const res = await fetch(`${urlStudies}?query=
        select Study_ID from ${StudiesAPIKey} where Study_ID='${id}'`);
    if (res.ok) {
        const dataStudy = await res.json();
        return dataStudy.data.length > 0;
    }
    return false;
}

/**
 * Adds a new user to the database with the provided information.
 * Returns true if the operation succeeds, false otherwise.
 */
export async function signupUser(id, email, firstName, lastName) {
    // Don't sign up user if they already exist
    if (await doesUserExists(id)) return false;

    const data = {
        "data": {
            "User_ID": id,
            "User_Email": email,
            "User_FirstName": firstName,
            "User_LastName": lastName
        }
    }
    const res = await fetch(urlUsers, {
        method: "POST",
        body: JSON.stringify(data),
    });
    return res.status === 201;
}
