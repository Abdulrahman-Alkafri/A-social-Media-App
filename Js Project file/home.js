let currentPage = 1
let lastPage = null;
// pagination
window.addEventListener("scroll", () => {
  const endOfPage = innerHeight + scrollY >= document.body.offsetHeight;
  if (endOfPage && currentPage < lastPage) {
    currentPage++;
    getPosts(currentPage);
  }
})
// pagination
function getPosts(page = 1) {
  axios.get(`${baseUrl}/posts?limit=80&page=${page}`).then((info) => {
    lastPage = info.data.meta.last_page;
    let posts = info.data.data;
    let postTitle = "";
    if (posts.title != null) postTitle = posts.title;
    for (let response of posts) {
      let user = getCurrentUser();
      let isItMyPost = user != null && response.author.id == user.id;
      let editBtn = "";
      if (isItMyPost) {
        editBtn = `
      <button type="button" class="btn btn-outline-danger float-end mx-2" onclick="deletePost('${encodeURIComponent(JSON.stringify(response))}')">Delete</button>
      <button type="button" class="btn btn-outline-secondary float-end" onclick="editPost('${encodeURIComponent(JSON.stringify(response))}')">Edit</button>
      `
      }
      let content = `<div class="card shadow rounded my-3">
            <div class="card-header">
              <span onclick="userClicked(${response.author.id})" style="cursor:pointer;">
                <img class="rounded-circle border border-3" src="${response.author.profile_image}" alt=""
                    style="height: 40px; width: 40px;">
                <b>${response.author.username}</b>
              </span>
                ${editBtn}
            </div>
            <div class="card-body" style="cursor:pointer;" onclick="postClicked(${response.id})">
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
    lastPage = info.data.meta.last_page;
  }).catch((error) => {
      const errorMessage = error.response.data.message;
      showAlert(errorMessage, "danger");
  });
}
function createNewPostClicked() {
  let postId = document.getElementById("is-it-edit").value;
  let isCreate = postId == null || postId == "";
  const body = document.getElementById("post-body-input").value;
  const title = document.getElementById("post-title-input").value;
  const image = document.getElementById("post-image-input").files[0];
  const token = localStorage.getItem("token");
  let formData = new FormData();
  formData.append("body", body);
  formData.append("title", title);
  formData.append("image", image);
  if (isCreate) {
    const url = `${baseUrl}/posts`;
    const header = {
      "Content-Type": "multipart/form-data",
      authorization: `Bearer ${token}`,
    };
    axios
      .post(url, formData, {
        headers: header,
      })
      .then(() => {
        closeModel("create-post-modal");
        showAlert("Post Created Successfully", "success");
        location.reload(true)
      })
      .catch((error) => {
        const errorMessage = error.response.data.message;
        showAlert(errorMessage, "danger");
      });
  }else {
    formData.append("_method","put")
      const url = `${baseUrl}/posts/${postId}`;
      const header = {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${token}`,
      };
      axios
        .post(url, formData, {
          headers: header,
        })
        .then(() => {
          closeModel("create-post-modal");
          showAlert("Post Edited Successfully", "success");
          location.reload(true)
        })
        .catch((error) => {
          const errorMessage = error.response.data.message;
          showAlert(errorMessage, "danger");
        });
  }
  
}
// scroll to top button 
function postClicked(id) {
    location.href = `post.html?postId=${id}`;
}
function editPost(PostObject) {
  let post = JSON.parse(decodeURIComponent(PostObject));
  document.getElementById("post-modal-submit-btn").innerHTML = "Update";
  document.getElementById("is-it-edit").value = post.id;
  document.getElementById("post-modal-title").innerHTML = "Edit Post";
  document.getElementById("post-title-input").value = post.title;
  document.getElementById("post-body-input").value = post.body;
  let PostModal = new bootstrap.Modal(document.getElementById("create-post-modal"),{});
  PostModal.toggle();
}
function deletePost(PostObject) {
  let post = JSON.parse(decodeURIComponent(PostObject));
  document.getElementById("post-delete-input-id").value = post.id
  let PostModal = new bootstrap.Modal(document.getElementById("delete-post-modal"),{});
  PostModal.toggle();
}
function confirmDelete() {
  let postId = document.getElementById("post-delete-input-id").value;
  const Url = `${baseUrl}/posts/${postId}`
  const token = localStorage.getItem("token");
  axios.delete(Url,{
    headers: {
      authorization: `Bearer ${token}`,
    }
  }).then(() => {
    closeModel("delete-post-modal");
    showAlert("Post Was Deleted Successfuly", "success");
    location.reload(true)
  }).catch((error) => {
          const errorMessage = error.response.data.message;
          showAlert(errorMessage, "danger");
  })
  
}
function addBtnClicked() {
   document.getElementById("post-modal-submit-btn").innerHTML = "Create";
  document.getElementById("is-it-edit").value ="";
  document.getElementById("post-modal-title").innerHTML = "Create A New Post";
  document.getElementById("post-title-input").value ="";
  document.getElementById("post-body-input").value = "";
  let PostModal = new bootstrap.Modal(document.getElementById("create-post-modal"),{});
  PostModal.toggle();
}
function userClicked(id) {
  location.href = `profile.html?userID=${id}`;
}