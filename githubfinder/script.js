class GitHubUser {
    constructor(data) {
        this.username = data.login;
        this.profileUrl = data.html_url;
        this.avatarUrl = data.avatar_url;
        this.publicRepos = data.public_repos;
        this.publicGists = data.public_gists;
        this.followers = data.followers;
        this.following = data.following;
        this.company = data.company;
        this.blog = data.blog;
        this.location = data.location;
        this.memberSince = new Date(data.created_at).toLocaleDateString();
    }

    getProfileUrl() {
        return this.profileUrl;
    }
}
function getGitHubUserProfile(username) {
    return fetch(`https://api.github.com/users/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('User not found');
            }
            return response.json();
        })
        .then(data => new GitHubUser(data));
}

function getGitHubUserRepos(username) {
    return fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => response.json());
}
function displayProfile(user) {
    const profileContainer = document.querySelector('.profile-container');
    const userPic = profileContainer.querySelector('.user-pic');
    const profileBox = profileContainer.querySelector('.profile-box');

    userPic.src = user.avatarUrl;
    profileBox.innerHTML = `
        <li>Company: ${user.company}</li>
        <li>Website/Blog: ${user.blog}</li>
        <li>Location: ${user.location}</li>
        <li>Member Since: ${user.memberSince}</li>
    `;
}

function displayRepos(repos) {
    const reposContainer = document.querySelector('.Latest-Repos-container');
    reposContainer.innerHTML = '';
    repos.slice(0, 5).forEach(repo => {
        const repoDiv = document.createElement('div');
        repoDiv.className = 'Repo';
        repoDiv.innerHTML = `
            <div class="title">${repo.name}</div>
            <button class="stars">Stars: ${repo.stargazers_count}</button>
            <button class="watchers">Watchers: ${repo.watchers}</button>
            <button class="Forks">Forks: ${repo.forks}</button>
        `;
        reposContainer.appendChild(repoDiv);
    });
}
const searchInput = document.querySelector('.search-input');

searchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const username = searchInput.value.trim();
        getGitHubUserProfile(username)
            .then(user => {
                displayProfile(user);
                return getGitHubUserRepos(username);
            })
            .then(repos => {
                displayRepos(repos);
            })
            .catch(error => {
                console.error(error);
            });
    }
});
