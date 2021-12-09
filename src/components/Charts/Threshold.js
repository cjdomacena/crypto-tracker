import React, { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { getCoinChart } from '../../api/getCoin';
import { useQuery } from 'react-query';
const ThresholdChart = ({ ...props }) =>
{
	const [coinData, setCoinData] = useState(null)
	const coinID = props.coinID
	const period = "24h"
	const converTimestamp = (timestamp) =>
	{
		const ts = timestamp * 1000;
		const d = new Date(ts)
		let hours = d.getUTCMinutes();
		if (hours < 10)
		{
			hours = "0" + hours
		}
		return { month: d.getUTCMonth() + 1, day: d.getDay() + 1, year: d.getUTCFullYear(), fullDate: d.toLocaleDateString('en-US', { timeZone: 'UTC' }), hour: `${ d.getUTCHours() }:${ hours }` }
	}
	const { data } = useQuery(`data-${ coinID }`, () => getCoinChart({
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
		},
		refetchInterval: 30 * 1000,
		refetchOnWindowFocus: true
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
	return (
		<div className='w-full h-auto mt-8 p-4 shadow'>
			<div className='pb-4 mb-4'>
				<h1>Hello</h1>
			</div>
			<div className='w-full h-96'>
				{coinData &&
					<ResponsiveContainer className={"w-full h-full"}>
						<AreaChart
							data={coinData}
							margin={{
								top: 10,
								right: 10,
								left: -10,
								bottom: 0,
							}}
							baseVale='dataMax'
							stackOffset='expand'
						>
							<Tooltip content={<CustomTooltip />} offset={5} />
							<XAxis dataKey="name" slope={25} />
							<YAxis />
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
