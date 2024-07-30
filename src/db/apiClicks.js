import { UAParser } from "ua-parser-js";
import supabase from "./supabase";

export async function getClicksForUrls(url_ids) {
	const { data: session, error } = await supabase.from("clicks").select("*").in("url_id", url_ids);

	if (error) {
		throw new Error("Unable to load clicks");
	}

	return session;
}

const parser = new UAParser();

export const storeClicks = async ({ id, original_url }) => {
	try {
		const res = parser.getResult();
		const device = res.type || "desktop";

		const response = await fetch("https://ipapi.co/json");
		const { city, country_name: country } = await response.json();

		await supabase.from("clicks").insert({
			url_id: id,
			city: city,
			country: country,
			device: device
		});

		window.location.href = original_url;
	} catch (error) {
		console.error("Error recording click:", error);
	}
};

export async function getClicksForUrl(url_id) {
	const { data, error } = await supabase.from("clicks").select("*").eq("url_id", url_id);

	if (error) {
		throw new Error("Unable to load stats");
	}

	return data;
}