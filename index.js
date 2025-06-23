// script.js
const baseUrl = 'http://localhost:3000/posts';

function displayPosts() {
  fetch(baseUrl)
    .then(res => res.json())
    .then(posts => {
      const postList = document.getElementById('post-list');
      postList.innerHTML = '';
      posts.forEach(post => {
        const li = document.createElement('li');
        li.className = 'post-item';
        li.dataset.id = post.id;
        li.innerHTML = `
          <strong>${post.title}</strong><br>
          <small>${post.author} &middot; ${post.date || '2024-01-01'}</small>
        `;
        li.addEventListener('click', handlePostClick);
        postList.appendChild(li);
      });

      if (posts.length > 0) {
        showPostDetail(posts[0]);
      }
    });
}

function handlePostClick(e) {
  const id = e.currentTarget.dataset.id;
  fetch(`${baseUrl}/${id}`)
    .then(res => res.json())
    .then(post => showPostDetail(post));
}

function showPostDetail(post) {
  const postInfo = document.getElementById('post-info');
  postInfo.innerHTML = `
    <h2>${post.title}</h2>
    <p><em>By ${post.author} &middot; ${post.date || '2024-01-01'}</em></p>
    <img src="${post.image || 'https://via.placeholder.com/600x300'}" alt="Post image" class="post-image">
    <p>${post.content || 'Nothing'}</p>
  `;
  document.getElementById('edit-button').classList.remove('hidden');
  document.getElementById('delete-button').classList.remove('hidden');
  document.getElementById('edit-button').onclick = () => showEditForm(post);
  document.getElementById('delete-button').onclick = () => deletePost(post.id);
  currentPost = post;
}

function addNewPostListener() {
  const form = document.getElementById('new-post-form');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const newPost = {
      title: document.getElementById('new-title').value,
      content: document.getElementById('new-content').value,
      author: document.getElementById('new-author').value,
      image: document.getElementById('new-image').value,
      date: new Date().toISOString().split('T')[0]
    };

    fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    })
    .then(res => res.json())
    .then(post => {
      displayPosts();
      form.reset();
    });
  });
}

function showEditForm(post) {
  const form = document.getElementById('edit-post-form');
  form.classList.remove('hidden');
  document.getElementById('edit-title').value = post.title;
  document.getElementById('edit-content').value = post.content;

  form.onsubmit = function(e) {
    e.preventDefault();
    const updatedPost = {
      ...post,
      title: document.getElementById('edit-title').value,
      content: document.getElementById('edit-content').value
    };
    showPostDetail(updatedPost);
    form.classList.add('hidden');
    displayPosts();
  };

  document.getElementById('cancel-edit').onclick = () => form.classList.add('hidden');
}

function deletePost(id) {
  fetch(`${baseUrl}/${id}`, { method: 'DELETE' })
    .then(() => displayPosts());
  document.getElementById('post-info').innerHTML = '<p>Select a post to view details.</p>';
  document.getElementById('edit-button').classList.add('hidden');
  document.getElementById('delete-button').classList.add('hidden');
}

function main() {
  displayPosts();
  addNewPostListener();
}

document.addEventListener('DOMContentLoaded', main);

let currentPost = null;
