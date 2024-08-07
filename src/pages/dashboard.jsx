/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { Filter } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LinkCard from "@/components/link-card";
import CreateLink from "@/components/create-link";
import Error from "@/components/error";

import useFetch from "@/hooks/use-fetch";

import { getUrls } from "@/db/apiUrls";
import { getClicksForUrls } from "@/db/apiClicks";
import { UrlState } from "@/context";

const Dashboard = () => {
	const [searchQuery, setSearchQuery] = useState("");

  const {user} = UrlState();
  const {loading: loadingFetch, error, data: urls, func: funcUrls} = useFetch(getUrls, user.id);
  const {
    loading: loadingClicks,
    data: clicks,
    func: fnClicks
  } = useFetch(
    getClicksForUrls,
    urls?.map((url) => url.id)
  );

  useEffect(() => {
    funcUrls();
  }, []);

  useEffect(() => {
    fnClicks();
  }, [urls?.length]);

	const filteredUrls = urls?.filter((url) =>
		url.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

  return (
    <div className="flex flex-col gap-8">
      {(loadingFetch || loadingClicks) && (
        <BarLoader width={"100%"} color="#36d7b7" />
      )}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{urls?.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{clicks?.length}</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between">
        <h1 className="text-4xl font-extrabold">My Links</h1>
				<CreateLink />
      </div>
      <div className="relative">
				<Input
					type="text"
					placeholder="Filter Links..."
					value={searchQuery}
					onChange={(event) => setSearchQuery(event.target.value)}
				/>
        <Filter className="absolute top-2 right-2 p-1" />
      </div>
      {error && <Error message={error?.message} />}
			{(filteredUrls || []).map((url, i) => {
				return <LinkCard key={i} url={url} fetchUrls={funcUrls} />
			})}
    </div>
  );
};

export default Dashboard;