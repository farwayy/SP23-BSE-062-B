const apiURL = 'https://jsonplaceholder.typicode.com/posts';
let currentPostId = null;

// Fetch and display posts (READ)
function fetchPosts() {
  fetch(apiURL)
    .then(response => response.json())
    .then(data => {
      const postsContainer = document.getElementById('posts');
      postsContainer.innerHTML = '';
      data.slice(0, 10).forEach(post => {
        const postItem = `
          <div class="col-md-4 post-item" id="post-${post.id}">
            <h5>${post.title}</h5>
            <p>${post.body}</p>
            <button class="btn btn-sm btn-warning" onclick="editPost(${post.id})">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deletePost(${post.id})">Delete</button>
          </div>
        `;
        postsContainer.innerHTML += postItem;
      });
    });
}

function createPost() {
  const title = document.getElementById('title').value;
  const body = document.getElementById('body').value;

  fetch(apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title,
      body: body,
      userId: 1,
    }),
  })
    .then(response => response.json())
    .then(post => {
      const postItem = `
        <div class="col-md-4 post-item" id="post-${post.id}">
          <h5>${post.title}</h5>
          <p>${post.body}</p>
          <button class="btn btn-sm btn-warning" onclick="editPost(${post.id})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deletePost(${post.id})">Delete</button>
        </div>
      `;
      document.getElementById('posts').innerHTML += postItem;
      clearForm();
    });
}

function editPost(id) {
  fetch(`${apiURL}/${id}`)
    .then(response => response.json())
    .then(post => {
      document.getElementById('title').value = post.title;
      document.getElementById('body').value = post.body;
      currentPostId = post.id;
      document.getElementById('addPostBtn').style.display = 'none';
      document.getElementById('updateBtn').style.display = 'inline-block';
    });
}

function updatePost() {
  const title = document.getElementById('title').value;
  const body = document.getElementById('body').value;

  fetch(`${apiURL}/${currentPostId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: currentPostId,
      title: title,
      body: body,
      userId: 1,
    }),
  })
    .then(response => response.json())
    .then(updatedPost => {
      const postItem = document.getElementById(`post-${updatedPost.id}`);
      postItem.querySelector('h5').textContent = updatedPost.title;
      postItem.querySelector('p').textContent = updatedPost.body;
      clearForm();
    });
}

function deletePost(id) {
  fetch(`${apiURL}/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      const postItem = document.getElementById(`post-${id}`);
      postItem.remove();
    });
}

function clearForm() {
  document.getElementById('title').value = '';
  document.getElementById('body').value = '';
  currentPostId = null;
  document.getElementById('addPostBtn').style.display = 'inline-block';
  document.getElementById('updateBtn').style.display = 'none';
}

window.onload = fetchPosts;
