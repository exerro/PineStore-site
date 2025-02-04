import { error } from "@sveltejs/kit";
import { getProject, getComments } from "$lib/database.js";

export const prerender = false;
export const ssr = true;

export async function load({ params }) {
	let projectData = getProject(params.id);
	let commentData = getComments(params.id);

	projectData = await projectData;
	commentData = await commentData;

	if (!projectData.success)
		throw error(404, projectData.error);

	return {
		project: projectData.project,
		comments: commentData.comments,
	};
};
