
import { requestOptions } from "../utils/reqOptions"
const apiURL = "https://api.coinstats.app/public/v1"
export const getCoinsAvgPrices = async ({ limit = 15, currency = "USD" }) =>
{
	try
	{
		const res = await fetch(`${ apiURL }/coins?skip=0&limit=${ limit }&currency=${ currency }`, requestOptions)
		const data = await res.json();
		return data
	} catch (e)
	{
		alert(e)
	}
}