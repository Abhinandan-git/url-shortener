import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LinkIcon, LogOut } from "lucide-react";
import { UrlState } from "@/context";
import useFetch from "@/hooks/use-fetch";
import { logout } from "@/db/apiAuth";
import { BarLoader } from "react-spinners";

const Header = () => {
	const navigate = useNavigate();
	const { user, fetchUser } = UrlState();

	const { loading, func: funcLogout } = useFetch(logout);
	
	return (
		<>
			<nav className="py-4 flex justify-between items-center">
				<Link to="/">
					<img src="/logo.png" className="h-16" alt="Shorter Logo" />
				</Link>

				<div>
					{!user ?
						// Login Button
						<Button onClick={() => navigate('/auth')}>Login</Button> :
						(
							// Dropdown menu
							<DropdownMenu>
								<DropdownMenuTrigger className="w-10 rounded-full overflow-hidden">

									{/* Avatar Icon */}
									<Avatar>
										<AvatarImage src={user?.user_metadata?.profile_pic} className="object-contain" />
										<AvatarFallback>G</AvatarFallback>
									</Avatar>
								</DropdownMenuTrigger>
								
								{/* Dropdown Menu Content */}
								<DropdownMenuContent>
									<DropdownMenuLabel>{user?.user_metadata?.name || "Guest"}</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem>
										<Link to="/dashboard" className="flex">
											<LinkIcon className="mr-2 h-4 w-4" />
											<span>My Links</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem className="text-red-400">
										{/* Logout Button */}
										<LogOut className="mr-2 h-4 w-4" />
										<span onClick={() => {
											funcLogout().then(() => {
												fetchUser();
												navigate("/");
											});
										}}>Logout</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)
					}
				</div>
			</nav>
			{loading && <BarLoader className="mb-4" width="100%" color="#2f4550" />}
		</>
	)
}

export default Header;