import { fetchAddress } from "./fetchAddress";

export const getNotifications=async(address:string)=>{
    const url = `https://backend-prod.epns.io/apis/v1/users/eip155:5:${address}/feeds`;
    const response = await fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  }
  
  export const filterNotifications=async(address:string)=>{
    let fetchedNotifications = await getNotifications(address);
    fetchedNotifications = fetchedNotifications?.feeds;
    let notiffeeds:String[] = [];
    const currentepoch:string = Math.floor(Date.now() / 1000).toString();
    if(fetchedNotifications.length > 0){
      for(let i = 0; i < fetchedNotifications.length; i++){
        let feedepoch = fetchedNotifications[i].payload.data.epoch;
        feedepoch = Number(feedepoch).toFixed(0);
        if(feedepoch > parseInt(currentepoch)-60) {               
          let msg = fetchedNotifications[i].payload.data.app+' : '+fetchedNotifications[i].payload.data.amsg;
          notiffeeds.push(msg);
        }
      }
    }
    notiffeeds = notiffeeds.reverse();
    return notiffeeds;
  }

export const fetchAllAddrNotifs = async () => {
    const addresses = await fetchAddress();
    let notifs:String[] = [];
    for(let i = 0; i < addresses.length; i++){
      let temp = await filterNotifications(addresses[i]);
      notifs = notifs.concat(temp);
    }
    return notifs;
};