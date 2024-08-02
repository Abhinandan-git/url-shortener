/* eslint-disable react-hooks/exhaustive-deps */
import { storeClicks } from "@/db/apiClicks";
import { getLongUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const RedirectLink = () => {
	const { id } = useParams();

	const {loading, data, func} = useFetch(getLongUrl, id);

	const {loading: loadingStats, func: funcStats} = useFetch(storeClicks, {
		id: data?.id,
		original_url: data?.original_url
	});

	useEffect(() => {
		func();
	}, []);
	
	useEffect(() => {
		if (!loading && data) {
			funcStats();
		}
	}, [loading]);

	if (loading || loadingStats) {
		return (<>
			<BarLoader width={"100%"} color="#36d7b7" />
			<br />
			Redirecting...
		</>)
	}

	return null;
}

export default RedirectLink;