function getCurrentUserID() {
  const urlParams = new URLSearchParams(location.search);
  const id = urlParams.get("userID");
  return id;
}

function getUser() {
  axios.get(`${baseUrl}/users/${getCurrentUserID()}`).then((response) => {
    const user = response.data.data;
    document.getElementById("image-header").src = user.profile_image;
    document.getElementById("email").innerHTML = user.email;
    document.getElementById("name").innerHTML = user.name;
    document.getElementById("username").innerHTML = user.username;
    document.getElementById("post-num").innerHTML = user.posts_count;
    document.getElementById("comment-num").innerHTML = user.comments_count;
    document.getElementById("post-title").innerHTML =
      user.username + "'s Posts";
  });
}
function getPosts() {
  axios
    .get(`${baseUrl}/users/${getCurrentUserID()}/posts`)
    .then((info) => {
      let posts = info.data.data;
      document.getElementById("user-posts").innerHTML = "";
      for (let post of posts) {
        let postTitle = "";
        if (post.title != null) postTitle = post.title;
        let user = getCurrentUser();
        let isItMyPost = user != null && post.author.id == user.id;
        let editBtn = "";
        if (isItMyPost) {
          editBtn = `
                <button type="button" class="btn btn-outline-danger float-end mx-2" onclick="deletePost('${encodeURIComponent(
                  JSON.stringify(post)
                )}')">Delete</button>
                <button type="button" class="btn btn-outline-secondary float-end" onclick="editPost('${encodeURIComponent(
                  JSON.stringify(post)
                )}')">Edit</button>
    `;
        }
        let content = `<div class="card shadow rounded my-3">
            <div class="card-header">
                <img class="rounded-circle border border-3" src="${post.author.profile_image}" alt=""
                    style="height: 40px; width: 40px;">
                <b>${post.author.username}</b>
                ${editBtn}
            </div>
            <div class="card-body" style="cursor:pointer;" onclick="postClicked(${post.id})">
                <img src="${post.image}" alt="" style="width: 100%;">
                <h6 style="color: #777;">${post.created_at}</h6>
                <h5>${postTitle}</h5>
                <p>${post.body}</p>
                <hr>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-pen" viewBox="0 0 16 16">
                    <path
                        d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                </svg>
                <span>${post.comments_count} comments
                <span id="post-tags-${post.id}"></span>
                </span>
            </div>
    </div>`;
        document.getElementById("user-posts").innerHTML += content;
      }
    })
    .catch((error) => {
      const errorMessage = error.message;
      showAlert(errorMessage, "danger");
    });
}
getUser();
getPosts();
