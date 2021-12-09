
import { requestOptions } from "../utils/reqOptions"
const apiURL = "https://api.coinstats.app/public/v1"


export const getCoin = async ( {coinID, currency = "USD"}) =>
{
	try
	{
		const req = await fetch(`${apiURL}/coins/${coinID}?currency=${currency}`, requestOptions);
		const data = await req.json();
		return data.coin;
	} catch (e)
	{
		alert(e);
	}
}

export const getCoinChart = async({coinID, currency = "USD", period="24h"}) => {
	try{
		const req = await fetch(`${ apiURL }/charts?period=${ period }&coinId=${ coinID }`, requestOptions);
		const data = await req.json();
		return data;
	}catch(e){
		alert(e);
	}

}

// export const getCoinsAvgPrices = async ({ coinID,currency = "USD" }) =>
// {
// 	try
// 	{
// 		const res = await fetch(`${ apiURL }/charts?period=1m&coinId=ethereum`, requestOptions)
// 		const data = await res.json();
// 		return data
// 	} catch (e)
// 	{
// 		alert(e)
// 	}
// }