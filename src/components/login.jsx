import { BeatLoader } from "react-spinners"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import Error from "./error"
import { useState } from "react"
import * as Yup from 'yup'

const Login = () => {
	const [errors, setErrors] = useState([]);

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleInputChange = (event) => {
		const {name, value} = event.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	}

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
					<Error message={"Invalid password"} />
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
						{true ? <BeatLoader size={10} color="#2f4550" /> : "Login"}
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}

export default Login
