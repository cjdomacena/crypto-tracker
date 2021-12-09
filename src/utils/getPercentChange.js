export const getPercentChange = (change) =>
{
	if (change < 0)
	{
		return <p className="p-1 rounded w-auto text-red-500 flex items-center font-semibold text-sm ">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
			{Math.abs(change)}%
		</p>
	}
	else
	{
		return <p className="p-1 rounded w-auto text-green-500 flex items-center font-semibold text-sm ">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
			{Math.abs(change)}%
		</p>
	}
}