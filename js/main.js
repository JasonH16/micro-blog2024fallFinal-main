const BASE_URL = "http://microbloglite.us-east-2.elasticbeanstalk.com";
 
const NO_AUTH_HEADERS = { 'accept': 'application/json', 'Content-Type': 'application/json' };
// ONLY 2 - INSECURE TOKEN FREE ACTIONS
 
//create user - sign up
/*
curl -X 'POST' \
  'http://microbloglite.us-east-2.elasticbeanstalk.com/api/users' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "string",
  "fullName": "string",
  "password": "string"
}'
*/
async function signUp(username, fullName, password) {
    const payload = JSON.stringify(
        { "username": username, "fullName": fullName, "password": password }
    );
 
    const response = await fetch(BASE_URL + "/api/users", {
        method: "POST",
        headers: NO_AUTH_HEADERS,
        body: payload
    }); //end fetch
 
    //TODO check for error response status codes
    if (response.status != 201) {
        console.log(response.status, response.statusText);
        return response.statusText;
    }
    const object = await response.json(); //COnvert body to object
    return object;
}
 
 
//login and store username and token received
/*
curl -X 'POST' \
  'http://microbloglite.us-east-2.elasticbeanstalk.com/auth/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "string",
  "password": "string"
}'
*/
async function login(username, password) {
    const payload = JSON.stringify({ "username": username, "password": password });
    const response = await fetch(BASE_URL + "/auth/login", {
        method: "POST",
        headers: NO_AUTH_HEADERS,
        body: payload
    }); //end fetch
 
    //TODO check for error response status codes
    if (response.status != 200) {
        console.log(response.status, response.statusText);
        return response.statusText;
    }
    const object = await response.json(); //COnvert body to object
    localStorage.token = object.token;
    localStorage.username = object.username;
    return object;
}
 
// ALL THE OTHERS NEED A TOKEN IN THE HEADER
function headersWithAuth() {
    //SAME AS NO AUTH BUT WITH AUTH ADDED
    return {
        ...NO_AUTH_HEADERS,
        'Authorization': `Bearer ${localStorage.token}`,
    }
}
// get secure list of message using token
async function getMessageList() {
    const LIMIT_PER_PAGE = 1000;
    const OFFSET_PAGE = 0;
    const queryString = `?limit=${LIMIT_PER_PAGE}&offset=${OFFSET_PAGE}`;
 
    const response = await fetch(
        BASE_URL + "/api/posts" + queryString, {
        method: "GET",
        headers: headersWithAuth(),
    });
    const object = await response.json();
    return object;
}
 
async function sendText(text){
    const response = await fetch(
        BASE_URL + "/api/posts", { // endpoint for messages/posts
        method: "POST", //CREATE
        headers: headersWithAuth(),
        body: `{"text":"${text}"}` //make json string by hand instead of stringify
    });
    const object = await response.json();
    return object;
}
function getGravatarUrl(email, size = 100) {
    const hashedEmail = CryptoJS.SHA256(email.trim().toLowerCase()).toString(CryptoJS.enc.Hex);
    return `https://www.gravatar.com/avatar/${hashedEmail}?s=${size}`;
};
function displayUserProfile(user) {
    greeting.textContent = `Hello, ${user.fullName || user.username}!`;
    const gravatarUrl = getGravatarUrl(user.username, 150);  
    profileInfo.innerHTML = `
        <div class="profile">
            <img src="${gravatarUrl}" alt="Profile Picture" class="gravatar"/>
            <h2>${user.fullName}</h2>
            <p><strong>Username: </strong>${user.username}</p>
            <p><strong>Bio: </strong>${user.bio || "No bio available"}</p>
        <p><strong>Joined:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
    `;
};
async function getUserProfile(username) {
    const response = await fetch(BASE_URL + `/api/users/${username}`, {
        method: "GET",
        headers: headersWithAuth(),
    });
    if (response.status === 200) {
        return response.json();
    } else {
        console.error("Failed to fetch user profile:", response.statusText);
        return null;
    };
};