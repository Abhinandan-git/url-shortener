import { BeatLoader } from "react-spinners"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import Error from "./error"
import { useEffect, useState } from "react"
import * as Yup from 'yup'
import useFetch from "@/hooks/use-fetch"
import { login } from "@/db/apiAuth"
import { useNavigate, useSearchParams } from "react-router-dom"
import { UrlState } from "@/context"

const Login = () => {
	const [errors, setErrors] = useState([]);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const navigate = useNavigate();
	let [searchParams] = useSearchParams();
	const longLink = searchParams.get("createNew");

	const handleInputChange = (event) => {
		const {name, value} = event.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	}

	const {data, error, loading, func: funcLogin} = useFetch(login, formData);
	const {fetchUser} = UrlState();

	useEffect(() => {
		if (error === null && data) {
			navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`)
			fetchUser();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, error])
	
	
	const handleLogin = async () => {
		setErrors([]);
		try {
			const schema = Yup.object().shape({
				email: Yup.string()
					.email("Invalid Email")
					.required("Email is required"),
				password: Yup.string()
					.min(6, "Password must be at least 6 characters")
					.required("Password is required"),
			});

			await schema.validate(formData, {abortEarly: false});

			await funcLogin();
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
					<CardTitle>Login</CardTitle>
					<CardDescription>to your account if you have one.</CardDescription>
					{error && <Error message={error.message} />}
				</CardHeader>

				<CardContent className="space-y-2">
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
				</CardContent>

				{/* Button */}
				<CardFooter>
					<Button onClick={handleLogin}>
						{loading ? <BeatLoader size={10} color="#2f4550" /> : "Login"}
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}

export default Login
