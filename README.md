# stress-study.github.io

### Login Flow

We use Auth0 as our login provider. This automatically provides functionality for users to create accounts, and it
provides us a unique user id for each person.

Using Auth0, our login flow looks like the follow:

- *Researchers*: For researchers, we simply prompt them to login.
- *Students*: First, we prompt students to login. Then, we ask them to enter a study ID, which they can then join.

Once a user logs in, we save their user id and study id to local storage for the extension to use.

### Sign-up

Since we're using the same page for login and sign-up, we do an additional check to see if we have their user ID saved
in our database.
If it isn't, then we first ask them for the first and last name, which we upload alongside their user ID.

