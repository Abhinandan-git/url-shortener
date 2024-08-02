import { UrlState } from "@/context"
import { useNavigate, useSearchParams } from "react-router-dom";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import Error from "./error";
import * as yup from 'yup';
import { useEffect, useRef, useState } from "react";
import useFetch from "@/hooks/use-fetch";
import { QRCode } from "react-qrcode-logo";
import { createUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";

const CreateLink = () => {
	const { user } = UrlState();
	const navigate = useNavigate();
	const ref = useRef();

	let [searchParams, setSearchParams] = useSearchParams();
	const long_link = searchParams.get("createNew");

	const [errors, setErrors] = useState({});
	const [formValues, setFormValues] = useState({
		title: "",
		long_url: long_link ? long_link : "",
		custom_url: ""
	});

	const schema = yup.object().shape({
		title: yup.string().required("Title is required"),
		long_url: yup.string().url("Must be a valid URL").required("Long URL is required"),
		custom_url: yup.string()
	});
	
	const handleChange = (event) => {
		setFormValues({
			...formValues,
			[event.target.id]: event.target.value
		});
	};

	const {loading, error, data, func: funcCreateUrl} = useFetch(createUrl, {...formValues, user_id: user.id});

	useEffect(() => {
		if (error === null && data) {
			navigate(`/link/${data[0].id}`);
		}
	}, [error, data]);

	const createNewLink = async () => {
		setErrors([]);
		try {
			await schema.validate(formValues, {abortEarly: false});
			const canvas = ref.current.canvasRef.current;
			const blob = await new Promise((resolve) => canvas.toBlob(resolve));
			await funcCreateUrl(blob);
		} catch (error) {
			const newErrors = {};
			error?.inner?.forEach((err) => {
				newErrors[err.path] = err.message;
			});
			setErrors(newErrors);
		}
	};

	return (
		<Dialog defaultOpen={long_link} onOpenChange={(res) => {
			if (!res) setSearchParams({});
		}}>
			<DialogTrigger>
				<Button variant="destructive">Create New Link</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
				</DialogHeader>
				
				{formValues?.long_url && <QRCode value={formValues?.long_url} size={250} ref={ref} />}

				<Input id="title" placeholder="Short link's title" onChange={handleChange} />
				{errors.title && <Error message={errors.title} />}
				
				<Input id="long_url" placeholder="Enter your long URL" onChange={handleChange} />
				{errors.long_url && <Error message={errors.long_url} />}

				<div className="flex items-center gap-2">
					<Card className="p-2">shortn.in</Card> / 
					<Input id="custom_url" placeholder="Custome Link (optional)" onChange={handleChange} />
				</div>
				{error && <Error message={error.message} />}

				<DialogFooter className="sm:justify-start">
					<Button disabled={loading} onClick={createNewLink} type="destructive">
						{loading ? <BeatLoader size={5} color="white" /> : "Create"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default CreateLink
