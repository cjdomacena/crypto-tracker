import { useState } from "react";
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import { getCoin } from './../api/getCoin'
import { getPercentChange } from "../utils/getPercentChange";
const Coin = () =>
{

	const param = useParams();
	const coinID = param.coinID;
	const [coin, setCoin] = useState(null);
	const currency = "USD"
	const { data, status } = useQuery(coinID, () => getCoin({ coinID, currency }), {
		onSuccess: (res) =>
		{
			setCoin(res)
		},
		refetchInterval: 5 * 1000, //5 seconds
		refetchOnWindowFocus: false
	})



	return (
		<div className="container mt-16">
			{coin &&
				<div className="p-4 w-full h-auto bg-gray-900">
					<div className="text-gray-50 w-auto">
						<div className=" flex items-center">
							<img src={coin.icon} className="w-4 h-4 mr-2" alt={`Icon for ${ coin.name }`} />
							<h1 className="text-lg mr-2">{coin.name}</h1>
							<p class="bg-gray-700 text-gray-100 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded w-auto">Rank #{coin.rank}</p>
							{getPercentChange(coin.priceChange1h)}
						</div>
					</div>
				</div>
			}

			{/* {coin ? console.log(coin) : ""} */}
		</div>
	)
}

export default Coin
