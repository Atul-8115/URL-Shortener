import { getLongUrl } from '@/db/apiUrl'
import { storeClicks } from '@/db/apiClicks'
import useFetch from '@/hooks/useFetch'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BarLoader } from 'react-spinners'

const RedirectLink = () => {
  const { id } = useParams()

  console.log("Printing id -> ",id)
 
  const {loading, data, fn} = useFetch(getLongUrl,id)

  console.log("Printing data in refirectLink page -> ",data);
  
  const {loading: loadingStats, fn: fnStats} = useFetch(storeClicks,{
    id: data?.id,
    originalUrl: data?.original_url,
  });

  
  useEffect(() => {
    fn();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(() => {
    if(!loading && data) {
      fnStats();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[loading])

  if(loading || loadingStats) {
    return (
      <>
        <BarLoader width={"100%"} color='#36d7b7'/>
        <br/>
        Redirecting...
      </>
    )
  }
  return null;
}

export default RedirectLink
