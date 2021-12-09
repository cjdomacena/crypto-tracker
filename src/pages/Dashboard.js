import { useRef, useState, useEffect } from "react"
import { useQuery, useInfiniteQuery } from "react-query"
import { getCoinsAvgPrices } from "../api/getCoins"
import { useNavigate } from "react-router-dom"
import { getPercentChange } from "../utils/getPercentChange"
const Dashboard = () =>
{
	const [limit, setLimit] = useState(10)
	const [coins, setCoins] = useState(null)
	const [sort, setSort] = useState("rank")

	// change

	let navigate = useNavigate()
	const handleClick = (coinID, coinData) =>
	{
		navigate(`coin/${ coinID }`);
	}

	const {
		status,
		data,
		error,
		isLoading,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		isFetching,
		isRefetching,
		refetch
	} = useInfiniteQuery(['data', limit], () => getCoinsAvgPrices({ limit }), {
		getNextPageParam: lastPage => lastPage.nextId,
		onSuccess: (res) =>
		{
			if (sort === "rank")
			{
				setCoins(res.pages[0].coins)
			}
			else if (sort === "priceChange")
			{
				setCoins((res.pages[0].coins).sort((a, b) =>
				{
					return parseFloat(b.priceChange1h) - parseFloat(a.priceChange1h);
				}))
			}
		},
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		refetchInterval: 5 * 1000, //5 s
		refetchIntervalInBackground: 5 * 1000
	})
	const getLocale = (rawData) =>
	{
		let data = Math.floor(rawData)

		return getAbbr(data)
	}

	const getAbbr = (num) =>
	{
		let numString = String(num)
		if (numString.length >= 9 && numString.length < 13)
		{
			return (num / 1000000000).toFixed(2) + " B"
		}
	}

	const sortData = (sortType) =>
	{
		setSort(sortType);
		refetch();
	}

	const navigateToCoin = (coinID) =>
	{
		navigate(`coin/${ coinID }`)
	}
	const Loading = () =>
	{
		if (isLoading)
		{
			return <div className='w-screen h-screen absolute top-0 left-0 z-50 bg-gray-900'>
				<div className='grid place-items-center w-full h-full'>
					<button type="button" class="inline-flex items-center px-4 py-2 border border-transparent text-white text-base leading-6  transition ease-in-out duration-150 cursor-not-allowed" disabled={true}>
						<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Processing
					</button>
				</div>
			</div>
		} else
		{
			return ""
		}
	}

	return (

		<div className="container h-auto mx-auto mb-8">
	
			<div className="py-4 overflow-auto ">
				<Loading />
				<table className="w-full  overflow-x-auto rounded border border-gray-800">
					<thead className="bg-gray-800">
						<tr>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider cursor-pointer" onClick={() => sortData("rank")}>
								Rank
							</th>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
								Name
							</th>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
								Price
							</th>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
								Price in BTC
							</th>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
								Market Cap
							</th>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
								Volume (24hr)
							</th>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider cursor-pointer" onClick={() =>
							{
								setSort("priceChange"); refetch()
							}}>
								% Change (1hr)
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-700 overflow-x-scroll">
					
						{coins && coins.map((coin) =>
						{
							return (<tr key={coin.id} className="hover:bg-gray-700" onClick={() => navigateToCoin(coin.id)}>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-50 " >
									{coin.rank}
								</td>

								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-50">
									<p className="flex items-center"><img src={coin.icon} className="w-4 h-4 mr-2" alt={`Icon for ${ coin.name }`} />{coin.name} -
										<span className="ml-2">	{coin.symbol}</span>
									</p>
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
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-50">
									{getPercentChange(coin.priceChange1h)}
								</td>
							</tr>)
						})}
					</tbody>
				</table>
			</div>
			<div className="space-x-4">
				<button className="bg-indigo-600 text-gray-50 px-4 py-2 rounded" onClick={() => setLimit(old => old + 5)} disabled={isFetching ? true : false}>
					Load More
				</button>
				<button className="bg-gray-700 text-gray-50 px-4 py-2 rounded" onClick={() => setLimit(10)} disabled={isFetching || isLoading ? true : false}>
					Reset
				</button>
			</div>
		</div>
	)
}

export default Dashboard
