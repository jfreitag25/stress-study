console.log(document.cookie)
if (document.cookie == null) {
    //redirect to login
    window.location.href = "login-student.html";
}