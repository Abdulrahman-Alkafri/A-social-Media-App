const urlParams = new URLSearchParams(location.search);
const id = urlParams.get("postId");
function showPost(id) {
  axios.get(`${baseUrl}/posts/${id}`).then((response) => {
    const post = response.data.data;
    const comments = post.comments;
    const author = post.author.username;
    console.log(response);
    document.getElementById("username-span").innerHTML = author;
  });
}
showPost(id);
