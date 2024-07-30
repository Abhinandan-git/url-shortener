import supabase, { supabaseUrl } from "./supabase";

export async function getUrls(user_id) {
	const { data: session, error } = await supabase.from("urls").select("*").eq("user_id", user_id);

	if (error) {
		throw new Error("Unable to load URLs");
	}

	return session;
}

export async function deleteUrl(id) {
	const { data: session, error } = await supabase.from("urls").delete().eq("id", id);

	if (error) {
		throw new Error("Unable to load URLs");
	}

	return session;
}

export async function createUrl({ title, long_url, custom_url, user_id }, qrcode) {
	const short_url = Math.random().toString(36).substring(2, 8);
	
	const fileName = `qr-${short_url}`;
	
	const {error: storageError} = await supabase.storage.from("qrs").upload(fileName, qrcode);

	if (storageError) throw new Error(storageError.message);

	const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;

	const { data, error } = await supabase.from("urls").insert([
		{
			title,
			original_url: long_url,
			custom_url: custom_url || null,
			user_id,
			short_url,
			qr
		}
	]).select();

	if (error) {
		throw new Error("Error creating short URL");
	}

	return data;
}