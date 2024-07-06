import Login from "@/components/login";
import Signup from "@/components/signup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";

const Auth = () => {
	const [searchParams] = useSearchParams();
	
	return (
		<div className="mt-36 flex flex-col items-center gap-10">
			<h1 className="text-5xl font-extrabold">
				{searchParams.get("createNew")
					? "Let's login first."
					: "Login / Signup"
				}
			</h1>

			<Tabs defaultValue="login" className="w-[400px]">
				{/* Tabs */}
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="login">Login</TabsTrigger>
					<TabsTrigger value="signup">Signup</TabsTrigger>
				</TabsList>

				{/* Tab contents */}
				<TabsContent value="login">
					<Login />
				</TabsContent>
				<TabsContent value="signup">
					<Signup />
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default Auth;