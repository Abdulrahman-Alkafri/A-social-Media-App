const urlParams = new URLSearchParams(location.search);
const id = urlParams.get("postId");
const spinner = document.getElementById("spinner");
function showPost(id) {
  spinner.removeAttribute("hidden");
  axios
    .get(`${baseUrl}/posts/${id}`)
    .then((response) => {
      const post = response.data.data;
      const comments = post.comments;
      const author = post.author;
      let postTitle = "";
      if (post.title != null) postTitle = post.title;
      document.getElementById("username-span").innerHTML = author.username;
      let comments_content = "";
      for (let comment of comments) {
        comments_content += ` 
      <div class="p-3" style ="background-color: rgb(199 212 255)">
            <div>
                <img class="rounded-circle" style="width: 40px; height: 40px;" src="${comment.author.profile_image}" alt="">
                <b>${comment.author.username}</b>
            </div>
            <div>${comment.body}</div>
            </div>
            `;
      }
      let content = `<div class="card shadow rounded my-3">
            <div class="card-header">
                <img class="rounded-circle border border-3" src="${author.profile_image}" alt=""
                    style="height: 40px; width: 40px;">
                <b>${author.username}</b>
            </div>
            <div class="card-body">
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
            <div id = "comments">
            ${comments_content}
            </div>
          <div class="my-3 d-flex">
            <input type="email" class="form-control mx-1" id="Comment-input" placeholder="Enter Your Comment">
            <button type="button" class="btn btn-outline-primary mx-1" onclick="createNewComment()">Add</button>
            </div>
    </div>`;
      document.getElementById("post").innerHTML = content;
      spinner.setAttribute("hidden", "");
    })
    .catch((error) => {
      const errorMessage = error.response.data.message;
      showAlert(errorMessage, "danger");
    });
}
function createNewComment() {
  let commentField = document.getElementById("Comment-input").value;
  let Url = `${baseUrl}/posts/${id}/comments`;
  let token = localStorage.getItem("token");
  let params = {
    body: commentField,
  };
  const header = {
    authorization: `Bearer ${token}`,
  };
  axios
    .post(Url, params, {
      headers: header,
    })
    .then(() => {
      showPost(id);
      showAlert("Comment Was Added Successfuly", "success");
    })
    .catch((error) => {
      const errorMessage = error.response.data.message;
      showAlert(errorMessage, "danger");
    });
}
showPost(id);
