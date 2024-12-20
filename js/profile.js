// Display user profile information
function displayUserProfile(user) {
    const gravatarUrl = getGravatarUrl(user.username, 150);  
    profileInfo.innerHTML = `
        <div class="profile">
            <img src="${gravatarUrl}" alt="Profile Picture" class="gravatar"/>
            <h2>${user.fullName}</h2>
            <p><strong>Username: </strong>${user.username}</p>
            <p><strong>Bio: </strong>${user.bio || "No bio available"}</p>
        <p><strong>Joined:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
    `;
};

// Display user's posts
function displayUserPosts(posts) {
    if (posts.length === 0) {
        postsContainer.innerHTML = "<p>You haven't posted anything yet!</p>";
    } else {
        postsContainer.innerHTML = `
            <div class="row">
                ${posts.map(post => `
                    <div class="col-md-6 mb-4">
                        <div class="post-card post" data-post-id="${post._id}">
                            <p><strong>When:</strong> ${timeAgo(post.createdAt)}</p>
                            <p>${post.text}</p>
                            <p><strong>Likes:</strong> ${post.likes.length}</p>
                            <button class="deletePostBtn" data-post-id="${post._id}">Delete Post</button>
                        </div>
                    </div>
                `).join("")}
            </div>
        `;
    };

    document.querySelectorAll(".deletePostBtn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const postId = e.target.getAttribute("data-post-id");
            const confirmed = confirm("Are you sure you want to delete this post?");
            if (confirmed) {
                const success = await deletePost(postId);
                if (success) {
                    alert("Post deleted successfully.");
                    location.reload();
                } else {
                    alert("Failed to delete the post. Please try again.");
                };
            };
        });
    });
};



document.addEventListener("DOMContentLoaded", async () => {

    // Set up the logout button
    const logOutButton = document.getElementById("logoutButton");
    logOutButton.addEventListener("click", async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        alert("You have been logged out.");
        window.location.href = "login.html";
    });

    // Fetch and display the user's profile
    const username = localStorage.username;
    const userProfile = await getUserProfile(username);
    if (userProfile) {
        displayUserProfile(userProfile);
        const userPosts = await getUserPosts(username);
        displayUserPosts(userPosts);
    };

    // Show the edit form when the button is clicked
    editProfileBtn.addEventListener("click", () => {
        editProfileModal.style.display = "block";
    });

    // Hide the edit form when the cancel button is clicked
    cancelEdit.addEventListener("click", () => {
        editProfileModal.style.display = "none";
    });

    editProfileForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const updatedProfile = {
            fullName: document.getElementById("editFullName").value || null,
            bio: document.getElementById("editBio").value || null,
            password: document.getElementById("editPassword").value || null,
        };

        // Send the update request
        const success = await updateUserProfile(localStorage.username, updatedProfile);
        if (success) {
            alert("Profile updated successfully!");
            location.reload(); // Refresh the page to show updated data
        } else {
            alert("Failed to update profile. Please fill out all inputs and try again.");
        }
    });
});
  // Logout button functionality
  logOutButton.addEventListener('click', () => {
    alert('You have been logged out.');
    // Redirect to login page or handle logout logic here
    window.location.href = "login.html";
});
document.addEventListener("DOMContentLoaded", () => {
    const uploadPic = document.getElementById("uploadPic");
    const profilePic = document.getElementById("profilePic");

    // Load the profile picture if it exists in local storage
    const savedProfilePic = localStorage.getItem("profilePic");
    if (savedProfilePic) {
        profilePic.src = savedProfilePic;
    }

    // Update the profile picture on file upload
    uploadPic.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePic.src = e.target.result;

                // Save the image in local storage
                localStorage.setItem("profilePic", e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
});
