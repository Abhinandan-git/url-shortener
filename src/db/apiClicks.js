import supabase from "./supabase";

export async function getClicksForUrls(url_ids) {
	const { data: session, error } = await supabase.from("clicks").select("*").in("url_id", url_ids);

	if (error) {
		throw new Error("Unable to load clicks");
	}

	return session;
}