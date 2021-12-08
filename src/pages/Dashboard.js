import { useRef, useState, useEffect } from "react"
import { useQuery, useInfiniteQuery } from "react-query"
import { getCoinsAvgPrices } from "../api/getCoins"

const Dashboard = () =>
{
	const [limit, setLimit] = useState(15)
	const [coins, setCoins] = useState(null)
	const {
		status,
		data,
		error,
		isLoading,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		isFetching,
		refetch
	} = useInfiniteQuery(['data', limit], () => getCoinsAvgPrices({ limit }), {
		getNextPageParam: lastPage => lastPage.nextId,
		onSuccess: (res) =>
		{
			setCoins(res.pages[0].coins)
		},
		keepPreviousData: true
	})
	const getLocale = (rawData) =>
	{
		let data = Math.floor(rawData)

		return getAbbr(data)
	}
	console.log(coins)

	const getAbbr = (num) =>
	{
		let numString = String(num)
		if (numString.length >= 9 && numString.length < 13)
		{
			return (num / 1000000000).toFixed(2) + " B"
		}
	}
	return (

		<div className="w-full h-full bg-gray-900 rounded">
			<table className="min-w-full divide-y divide-gray-50 divide-y-2">
				<thead className="bg-gray-100">
					<tr>
						<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Rank
						</th>
						<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Symbol
						</th>
						<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Name
						</th>
						<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Price
						</th>
						<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Price in BTC
						</th>
						<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Market Cap
						</th>
						<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Volume (24hr)
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-700">
					{isLoading ? <tr>
						<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-50">
							<div className="h-4 bg-gray-600 rounded w-4/5  animate-pulse"></div>
						</td>
						<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-50">
							<div className="h-4 bg-gray-600 rounded w-4/5  animate-pulse"></div>
						</td>
						<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-50">
							<div className="h-4 bg-gray-600 rounded w-4/5  animate-pulse"></div>
						</td>
						<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-50">
							<div className="h-4 bg-gray-600 rounded w-4/5  animate-pulse"></div>
						</td>
						<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-50">
							<div className="h-4 bg-gray-600 rounded w-4/5  animate-pulse"></div>
						</td>
						<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-50">
							<div className="h-4 bg-gray-600 rounded w-4/5  animate-pulse"></div>
						</td>
					</tr> : ""}
					{coins ? coins.map((coin) =>
					{
						return (<tr key={coin.id}>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-50">
								{coin.rank}
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-50">
								{coin.symbol}
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-50">
								<p className="flex items-center"><img src={coin.icon} className="w-4 h-4 mr-2" alt={`Icon for ${ coin.name }`} />{coin.name}</p>
							</td>

							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-50 font-bold">
								$ {(coin.price).toFixed(2).toLocaleString('en-US')}
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-50 font-bold">
								{(coin.priceBtc).toFixed(8)}
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-50 font-bold">
								$ {getLocale(coin.marketCap)}
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-50">
								{getLocale(coin.volume)}
							</td>
						</tr>)
					}) : ""}
				</tbody>
			</table>
			<div className="bg-gray-50 w-full p-4 mb-12">
				<button onClick={() =>
				{
					setLimit(old => old += 5)
				}}
					disabled={isFetching}>
					{isLoading || isFetching ? "Loading..." : "Load more"}
				</button>
			</div>

		</div>
	)
}

export default Dashboard
