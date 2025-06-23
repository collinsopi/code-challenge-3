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

function showEditForm(post) {
    const form 
}
