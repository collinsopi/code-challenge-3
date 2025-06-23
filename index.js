const baseUrl = 'http://localhost:3000/posts';

function displayPosts() {
    fetch(baseUrl)
    .then(res => res.json())
    .then(posts => {
        const postList = document.getElementById('post-list');
        postList.innerHTML = '';
        posts.forEach(post => {
            const div = document.createElement('div');
            div.textContent = post.title;
            div.dataset.id = post.id;
            div.addEventListener('click', handlePostClick);
            postList.appendChild(div);
        });

        //show first post details by default
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
    <h3>${post.title}</h3>
    <p>${post.content}</p>
    <p><strong>Author:</strong>${post.author}</p>
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
            title:document.getElementById('new-title').value,
            content:document.getElementById('new-content').value,
            author:document.getElementById('new-author').value
        };
        const div = document.createElement('div');
        div.textContent = newPost.title;
        div.dataset.id = 'temp';
        div.addEventListener('click', () => showPostDetail(newPost));
        document.getElementById('post-list').appendChild(div);

        form.reset();
    });
}

function showEditForm(post) {
    const form = document.getElementById('edit-post-form');
    form.classList.remove('hidden');
    document.getElementById('edit-title').value = post.title;
    document.getElementById('edit-content').value = post.content;

    form.onsubmit = function(e) {
        e.preventDefault();
        post.title = document.getElementById('edit-title').value;
        post.content = document.getElementById('edit-content').value;
        showPostDetail(post);
        form.classList.add('hidden');
        displayPosts();
    };

    document.getElementById('cancel-edit').onclick = () =>form.classList.add('hidden');
}

function deletePost(id) {
    const postList = document.getElementById('post-list');
    const postDivs = postList.querySelectorAll('div');
    postDivs.forEach(div => {
        if (div.dataset.id == id) div.remove();
    });
    document.getElementById('post-info').innerHTML = '<p>Select a post to view details</p>'
    document.getElementById('edit-button').classList.add('hidden');
    document.getElementById('delete-button').classList.add('hidden');
}

function main() {
    displayPosts();
    addNewPostListener();
}

document.addEventListener('DOMContentLoaded', main);

let currentPost = null;