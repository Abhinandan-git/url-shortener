import supabase from "./supabase";

export async function getUrls(user_id) {
	const { data: session, error } = await supabase.from("urls").select("*").eq(user_id);

	if (error) {
		throw new Error("Unable to load URLs");
	}

	return session;
}