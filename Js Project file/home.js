let currentPage = 1
let lastPage = 1;
// pagination
window.addEventListener("scroll", () => {
  const endOfPage = innerHeight + scrollY >= document.body.offsetHeight;
  if (endOfPage && currentPage < lastPage) {
    currentPage++;
    getPosts(currentPage);
  }
})
// pagination
async function getPosts(page = 1) {
try {
    const info = await axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=80&page=${page}`);
    lastPage = info.data.meta.last_page;
    let posts = info.data.data;
    let postTitle = "";
    if (posts.title != null) postTitle = posts.title;
    for (let response of posts) {
        let content = `<div class="card shadow rounded my-3">
            <div class="card-header">
                <img class="rounded-circle border border-3" src="${response.author.profile_image}" alt=""
                    style="height: 40px; width: 40px;">
                <b>${response.author.username}</b>
            </div>
            <div class="card-body" onclick="postClicked(${response.id})">
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
  } catch (error) {
    showAlert("Error fetching posts:" + error , "danger")
  }
}
function createNewPostClicked() {
  const body = document.getElementById("post-body-input").value;
  const title = document.getElementById("post-title-input").value;
  const image = document.getElementById("post-image-input").files[0];
  const url = `${baseUrl}/posts`;
  const token = localStorage.getItem("token");
  let formData = new FormData();
  formData.append("body", body);
  formData.append("title", title);
  formData.append("image", image);
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
      getPosts(1);
    })
    .catch((error) => {
      const errorMessage = error.response.data.message;
      showAlert(errorMessage, "danger");
    });
}
function scrollToTop() {
  // scroll to top button 
  let mybutton = document.getElementById("btn-back-to-top");

  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      mybutton.style.display = "block";
    } else {
      mybutton.style.display = "none";
    }
  }
  // When the user clicks on the button, scroll to the top of the document
  mybutton.addEventListener("click", backToTop);

  function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
}
// scroll to top button 
function postClicked(id) {
    location.href = `post.html?postId=${id}`;
}
getPosts();
scrollToTop();