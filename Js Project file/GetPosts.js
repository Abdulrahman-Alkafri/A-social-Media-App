const baseUrl = "https://tarmeezacademy.com/api/v1";
async function getPosts() {
  let info = await axios.get(
    "https://tarmeezacademy.com/api/v1/posts?limit=80"
  );
  console.log(info.data.data);
  document.getElementById("post").innerHTML = "";
  let posts = info.data.data;
  const postTitle = "";
  if (posts.title != null) postTitle = posts.title;
  for (let response of posts) {
    let content = `<div class="card shadow rounded my-3">
            <div class="card-header">
                <img class="rounded-circle border border-3" src="${response.author.profile_image}" alt=""
                    style="height: 40px; width: 40px;">
                <b>${response.author.username}</b>
            </div>
            <div class="card-body">
                <img src="${response.image}" alt="" style="width: 100%;">
                <h6 style="color: #777;">${response.created_at}</h6>
                <h5>${postTitle}</h5>
                <p>${response.body}</p>
                <hr>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-pen" viewBox="0 0 16 16">
                    <path
                        d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                </svg>
                <span>${response.comments_count} comments
                <span id="post-tags-${response.id}"></span>
                </span>
            </div>
        </div>`;
    document.getElementById("post").innerHTML += content;
    let cuurentPostTag = `post-tags-${response.id}`;
    document.getElementById(cuurentPostTag).innerHTML = "";
    for (tags of response.tags) {
      let tagContent = `
       <button class="btn btn-sm rounded-5 btn-secondary">
                ${tags.name}
            </button>
      `;
      document.getElementById(cuurentPostTag) += tagContent;
    }
  }
}
async function loginBtnClicked() {
  let username = document.getElementById("username-input").value;
  let password = document.getElementById("password-input").value;
  const url = `${baseUrl}/login`;
  const params = {
    username: username,
    password: password,
  };
  let response = await axios.post(url, params);
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));
  const modal = document.getElementById("login-modal");
  const modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.hide();
  showAlert("Logged In");
  setUi();
}
function showAlert(message) {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };
  appendAlert(` ${message} successfuly `, "success");
}
function setUi() {
  const token = localStorage.getItem("token");
  const logedInDiv = document.getElementById("logged-in");
  const loggedOut = document.getElementById("logged-out");
  if (token == null) {
    logedInDiv.style.setProperty("display", "flex", "important");
    loggedOut.style.setProperty("display", "none", "important");
  } else {
    logedInDiv.style.setProperty("display", "none", "important");
    loggedOut.style.setProperty("display", "flex", "important");
  }
}
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showAlert("Logged out");
  setUi();
}
async function registration() {
  const username = document.getElementById("register-username-input").value;
  const password = document.getElementById("register-password-input").value;
  const name = document.getElementById("register-name-input").value;
  const url = `${baseUrl}/register`;
  const params = {
    "username": username,
    "password": password,
    "name": name,
  };
  let response = await axios.post(url, params);
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));
  const modal = document.getElementById("register-modal");
  const modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.hide();
  showAlert("Registration done");
  setUi();
}
getPosts();
setUi();
