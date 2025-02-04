
export const BASE_URL = "https://pinestore.cc";
// export const BASE_URL = "http://localhost:3704";

/**
 * Interact with the PineStore API
 * @param {"GET" | "POST"} method 
 * @param {string} path 
 * @param {object?} body for POST request
 * @returns 
 */
async function api(method, path, body) {
	let requestInit = {
		"headers": {}
	}
	if (path.startsWith("auth/")) {
		let session = getCookie("session");
		if (session == null) return {
			success: false,
			error: "You are not logged in!",
		};
		requestInit["headers"]["authorization"] = session;
	}
	if (method == "POST") {
		requestInit["method"] = "POST";
		requestInit["body"] = JSON.stringify(body);
		requestInit["headers"]["Content-Type"] = "application/json";
	}

	const raw = await fetch(BASE_URL + "/api/" + path, requestInit);
	const data = await raw.json();

	return data;
}

function getCookie(cookieId) {
	if (typeof document == "undefined")
		return null;
	const cookieValue = document.cookie
		.split("; ")
		.find((row) => row.startsWith(cookieId + "="))
		?.split("=")[1];
	return cookieValue;
}

function removeEmptyStrings(data) {
	for (const key in data)
		if (typeof data[key] == "string" && !(data[key]?.length > 0))
			data[key] = null;
	return data;
}

export const getProject = (id) =>
	api("GET", "project/" + id);
export const getComments = (projectId) =>
	api("GET", "project/" + projectId + "/comments");

export const getProjects = () =>
	api("GET", "projects");
export const searchProjects = (query) =>
	api("GET", "projects/search?q=" + encodeURIComponent(query));

export const getUser = (id) =>
	api("GET", "user/" + id);
export const getUserProjects = (id) =>
	api("GET", "user/" + id + "/projects");
export const authDiscord = (code) =>
	api("GET", "discordauth/" + code);

export const reportProjectView = (id) =>
	api("POST", "log/view", { projectId: id });
export const reportProjectDownload = (id) =>
	api("POST", "log/download", { projectId: id });

export const getMyProfile = () =>
	api("GET", "auth/profile");
export const getMyProjects = () =>
	api("GET", "auth/profile/projects");
export const getUserOptions = () =>
	api("GET", "auth/profile/options");
export const setUserOptions = (options) =>
	api("POST", "auth/profile/options", options);
export const setProfileInfo = (profileData) =>
	api("POST", "auth/profile/update", removeEmptyStrings({
		"allow_null": true,
		"name": profileData.name,
		"about": profileData.about,
		"about_markdown": profileData.about_markdown,
		"connections": profileData.connections,
	}));

export const setProjectInfo = (projectData) =>
	api("POST", "auth/project/update", removeEmptyStrings({
		allow_null: true,
		projectId: projectData.id,
		...projectData,
	}));
export const newProject = (name) =>
	api("POST", "auth/project/new", { name });
export const deleteProject = (id) =>
	api("POST", "auth/project/delete", { projectId: id });
export const publishProjectUpdate = (id) =>
	api("POST", "auth/project/publishupdate", { projectId: id });

export const addProjectMedia = (projectId, imageData) =>
	api("POST", "auth/media/add", { projectId, imageData });
export const removeProjectMedia = (projectId, index) =>
	api("POST", "auth/media/remove", { projectId, index });
export const setProjectThumbnail = (projectId, imageData) =>
	api("POST", "auth/media/thumbnail", { projectId, imageData });

export const newComment = (projectId, replyId, text) =>
	api("POST", "auth/comment", { projectId, replyId, text });
export const deleteComment = (id) =>
	api("POST", "auth/comment/delete", { commentId: id });

export const getNotifications = () =>
	api("GET", "auth/notifications");
export const hasUnreadNotifications = () =>
	api("GET", "auth/notifications/unread");

export const followUser = (userId) =>
	api("POST", "auth/follow/user/new", { following_id: userId });
export const checkFollowingUser = (userId) =>
	api("GET", "auth/follow/user/check/" + userId);
export const unfollowUser = (userId) =>
	api("POST", "auth/follow/user/remove", { following_id: userId });

export const followProject = (id) =>
	api("POST", "auth/follow/project/new", { project_id: id });
export const checkFollowingProject = (id) =>
	api("GET", "auth/follow/project/check/" + id);
export const unfollowProject = (id) =>
	api("POST", "auth/follow/project/remove", { project_id: id });

export const saveProject = (id) =>
	api("POST", "auth/saved/new", { project_id: id });
export const checkSavedProject = (id) =>
	api("GET", "auth/saved/check/" + id);
export const unsaveProject = (id) =>
	api("POST", "auth/saved/remove", { project_id: id });
export const getMySavedProjects = (id) =>
	api("GET", "auth/saved");

export async function isLoggedIn() {
	let profileData = await getMyProfile();
	return profileData?.user?.discord_id != null;
}

export function logoutUser() {
	document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	window.location.href = "/";
}