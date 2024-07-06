import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
	const [longUrl, setLongUrl] = useState();
	const navigate = useNavigate();

	const handleShorten = (event) => {
		event.preventDefault();
		if (longUrl) {
			navigate(`/auth?createNew=${longUrl}`);
		}
	}
	
	return (
		<div className="flex flex-col items-center">
			{/* Main Heading */}
			<h2 className="my-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-white text-center font-extrabold">
				A customized URL shortener<br />Trim your long URLs.
			</h2>

			{/* Form */}
			<form onSubmit={handleShorten} className="sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2">
				{/* Input field for URL */}
				<Input
					type="url"
					value={longUrl}
					placeholder="Enter the URL"
					onChange={(event) => setLongUrl(event.target.value)}
					className="h-full flex-1 py-4 px-4"
				/>
				
				{/* Shorten button */}
				<Button className="h-full" type="submit" variant="destructive">Shorten</Button>
			</form>

			{/* FAQs section */}
			<Accordion type="single" collapsible className="mt-11 w-full md:px-11">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            How does the Trimrr URL shortener works?
          </AccordionTrigger>
          <AccordionContent>
            When you enter a long URL, our system generates a shorter version of that URL. This shortened URL redirects to the original long URL when accessed.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            Do I need an account to use the app?
          </AccordionTrigger>
          <AccordionContent>
            Yes. Creating an account allows you to manage your URLs, view analytics, and customize your short URLs.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            What analytics are available for my shortened URLs?
          </AccordionTrigger>
          <AccordionContent>
            You can view the number of clicks, geolocation data of the clicks and device types (mobile/desktop) for each of your shortened URLs.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
		</div>
	)
}

export default LandingPage;