import { BeatLoader } from "react-spinners"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import Error from "./error"
import { useEffect, useState } from "react"
import * as Yup from 'yup'
import useFetch from "@/hooks/use-fetch"
import { signup } from "@/db/apiAuth"
import { useNavigate, useSearchParams } from "react-router-dom"
import { UrlState } from "@/context"

const Signup = () => {
	const [errors, setErrors] = useState([]);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		profile_pic: null
	});

	const navigate = useNavigate();
	let [searchParams] = useSearchParams();
	const longLink = searchParams.get("createNew");

	const handleInputChange = (event) => {
		const {name, value, files} = event.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: files ? files[0] : value,
		}));
	}

	const {data, error, loading, func: funcSignup} = useFetch(signup, formData);
	const {fetchUser} = UrlState();

	useEffect(() => {
		if (error === null && data) {
			navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`)
			fetchUser();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, error])
	
	
	const handleSignup = async () => {
		setErrors([]);
		try {
			const schema = Yup.object().shape({
				name: Yup.string()
					.required("Name is required"),
				email: Yup.string()
					.email("Invalid Email")
					.required("Email is required"),
				password: Yup.string()
					.min(6, "Password must be at least 6 characters")
					.required("Password is required"),
				profile_pic: Yup.mixed()
					.required("Profile picture is required")
			});

			await schema.validate(formData, {abortEarly: false});

			await funcSignup();
		} catch (error) {
			const newErrors = {};

			error?.inner?.forEach((err) => {
				newErrors[err.path] = err.message;
			});

			setErrors(newErrors);
		}
	};
	
	return (
		<div>
			<Card>
				<CardHeader>
					<CardTitle>Signup</CardTitle>
					<CardDescription>
						Create a new account if you haven&rsquo;t already
					</CardDescription>
					{error && <Error message={error.message} />}
				</CardHeader>

				<CardContent className="space-y-2">
					{/* Email portion */}
					<div className="space-y-1">
						<Input
							name="name"
							type="text"
							placeholder="Enter your name"
							onChange={handleInputChange}
						/>
						{errors.name && <Error message={errors.name} />}
					</div>
					
					{/* Email portion */}
					<div className="space-y-1">
						<Input
							name="email"
							type="email"
							placeholder="Enter your email"
							onChange={handleInputChange}
						/>
						{errors.email && <Error message={errors.email} />}
					</div>
					
					{/* Password portion */}
					<div className="space-y-1">
						<Input
							name="password"
							type="password"
							placeholder="Enter your password"
							onChange={handleInputChange}
						/>
						{errors.password && <Error message={errors.password} />}
					</div>

					{/* Password portion */}
					<div className="space-y-1">
						<Input
							name="profile_pic"
							type="file"
							accept="image/*"
							onChange={handleInputChange}
						/>
						{errors.profile_pic && <Error message={errors.profile_pic} />}
						</div>
				</CardContent>

				{/* Button */}
				<CardFooter>
					<Button onClick={handleSignup}>
						{loading ? <BeatLoader size={10} color="#2f4550" /> : "Create Account"}
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}

export default Signup
