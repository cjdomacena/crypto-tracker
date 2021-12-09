import { Link } from "react-router-dom"
const Nav = () => {
	return (
		<nav className="w-full h-auto bg-gray-800 text-gray-50 shadow drop-shadow">
			<div className="xl:container lg:container w-full h-14 p-4 mx-auto">
				<Link to="/">Hello</Link>
			</div>
		</nav>
	)
}

export default Nav
