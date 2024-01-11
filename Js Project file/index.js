// ملف الدوال المشتركة
const baseUrl = "https://tarmeezacademy.com/api/v1";
function loginBtnClicked() {
  let username = document.getElementById("username-input").value;
  let password = document.getElementById("password-input").value;
  const url = `${baseUrl}/login`;
  const params = {
    username: username,
    password: password,
  };
  axios
    .post(url, params)
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      closeModel("login-modal");
      showAlert("Logged In successfuly", "success");
      setUi();
    })
    .catch((error) => {
      const errorMessage = error.response.data.message;
      showAlert(errorMessage, "danger");
    });
}
function registration() {
  const username = document.getElementById("register-username-input").value;
  const password = document.getElementById("register-password-input").value;
  const name = document.getElementById("register-name-input").value;
  const image = document.getElementById("register-image-input").files[0];
  const url = `${baseUrl}/register`;
  let formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("name", name);
  formData.append("image", image);

  axios
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      closeModel("register-modal");
      showAlert("Registration done successfuly", "success");
      setUi();
    })
    .catch((error) => {
      const errorMessage = error.response.data.message;
      showAlert(errorMessage, "danger");
    });
}
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showAlert("Logged out successfuly", "success");
  setUi();
}
function showAlert(message, type) {
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
  appendAlert(` ${message}`, type);
}
function setUi() {
  const token = localStorage.getItem("token");
  const logedInDiv = document.getElementById("logged-in");
  const loggedOut = document.getElementById("logged-out");
  const addBtn = document.getElementById("add-btn");
  if (token == null) {
    logedInDiv.style.setProperty("display", "flex", "important");
    loggedOut.style.setProperty("display", "none", "important");
    if (addBtn != null) {
      addBtn.style.setProperty("display", "none", "important");
    }
  } else {
    logedInDiv.style.setProperty("display", "none", "important");
    loggedOut.style.setProperty("display", "flex", "important");
    if (addBtn != null) {
      addBtn.style.setProperty("display", "block", "important");
    }
    const user = getCurrentUser();
    document.getElementById("nav-username").innerHTML = user.username;
    document.getElementById("nav-img").src = user.profile_image;
  }
}
function closeModel(id) {
  const modal = document.getElementById(id);
  const modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.hide();
}
function getCurrentUser() {
  let user = null;
  const LocalStorageUser = localStorage.getItem("user");
  if (LocalStorageUser != null) {
    user = JSON.parse(LocalStorageUser);
  }
  return user;
}
setUi();
