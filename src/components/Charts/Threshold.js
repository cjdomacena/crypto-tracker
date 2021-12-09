import React, { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { getCoinChart } from '../../api/getCoin';
import { useQuery } from 'react-query';
import { queryClient } from '../..';
const ThresholdChart = ({ ...props }) =>
{
	const [coinData, setCoinData] = useState(null)
	const coinID = props.coinID
	const [period, setPeriod] = useState('24h')
	const [minValue, setMinValue] = useState(0)
	const [maxValue, setMaxValue] = useState(0);
	const converTimestamp = (timestamp) =>
	{
		const ts = timestamp * 1000;
		const d = new Date(ts)
		let hours = d.getUTCMinutes();
		if (hours < 10)
		{
			hours = "0" + hours
		}
		return { month: d.getMonth() + 1, day: d.getDay() + 1, year: d.getFullYear(), fullDate: d.toLocaleDateString('en-US', { timeZone: 'UTC' }), hour: `${ d.getHours() }:${ hours }` }
	}
	const { data, refetch, isLoading, isError, isRefetching, isFetched, isPreviousData } = useQuery(`data-${ coinID }-${period}`, () => getCoinChart({
		coinID,
		period
	}), {
		onSuccess: (res) =>
		{
			let temp = []

			for (let i = 0; i < res.length; i++)
			{
				const price = res[i][1].toFixed(2)
				temp.push({ name: getLabel(period, converTimestamp(res[i][0])), value: price })
			}

			setCoinData(temp)
			if (coinData)
			{
				const max = Math.max(...coinData.map((max) =>
				{
					return max.value
				}))
				const min = Math.min(...coinData.map((min) =>
				{
					return min.value
				}))
				setMaxValue(max)
				setMinValue(min)
			}

		},
		refetchInterval: 30 * 1000,
		refetchOnWindowFocus: false
	})
	const getMonthString = (month) =>
	{
		let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

		return months[month - 1]
	}
	const getLabel = (type, obj) =>
	{
		let label = ""
		switch (type)
		{
			case '24h':
				label = obj.hour;
				break;
			case '1m':
				label = `${ getMonthString(obj.month) }'${ obj.day }`
				break;
			case '3m':
				label = `${ getMonthString(obj.month) }'${ obj.day }`
				break;
			case 'all':
				label = `${ getMonthString(obj.month) }'${ obj.day }`;
				break;
			default:
				label = obj.fullDate
				break;
		}
		return label;
	}

	const handleClick = (e) =>
	{
		setPeriod(e.target.value)

		refetch();
	}

	const Loading = () =>
	{
		if (isLoading || isRefetching)
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
		}else {
			return ""
		}
	}

	return (
		<div className='w-full h-auto mt-8 p-4 shadow'>
			<div className='pb-4 mb-4 flex justify-end'>
				<div className='text-gray-500 space-x-4 text-sm'>
					<button className={`${ period === '24h' && "text-white font-semibold" } hover:text-white`} value="24h" onClick={(e) => handleClick(e)}>24h</button>
					<button className={`${ period === '1w' && "text-white font-semibold" } hover:text-white`} value="1w" onClick={(e) => handleClick(e)}>1w</button>
					<button className={`${ period === '1m' && "text-white font-semibold" } hover:text-white`} value="1m" onClick={(e) => handleClick(e)}>1m</button>
					<button className={`${ period === '3m' && "text-white font-semibold" } hover:text-white`} value="3m" onClick={(e) => handleClick(e)}>3m</button>
					<button className={`${ period === '1y' && "text-white font-semibold" } hover:text-white`} value="1y" onClick={(e) => handleClick(e)}>1y</button>
					<button className={`${ period === 'all' && "text-white font-semibold" } hover:text-white`} value="all" onClick={(e) => handleClick(e)}>All</button>
				</div>
			</div>
			<div className='w-full h-96'>
				<Loading/>
				{coinData &&
					<ResponsiveContainer className={"w-full h-full"}>
						<AreaChart
							data={coinData}
							margin={{
								top: 10,
								right: 0,
								left: 0,
								bottom: 10,
							}}
						>
							<Tooltip content={<CustomTooltip />} offset={5} />
							<XAxis dataKey="name"  />
							<YAxis type="number" domain={['auto', maxValue]} tickCount={15} allowDecimals={true} interval={"preserveStartEnd"}/>
							<Area type="monotone" dataKey="value" stroke="#FF9332" fill="#111827" strokeWidth={2} />

						</AreaChart>
					</ResponsiveContainer>
				} 
			</div>
		</div>
	)
}
const CustomTooltip = ({ payload, active }) =>
{
	if (payload && active && payload.length)
	{
		return <p className='text-gray-50 p-2 bg-gray-800 text-sm'>USD {payload[0].value} - {(payload[0].payload.name)}</p>
	}
	else
	{
		return ""
	}
}
export default ThresholdChart
