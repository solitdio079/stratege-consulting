/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import { useFetcher } from 'react-router'
import InfiniteScroll from 'react-infinite-scroll-component'
import toast, { Toaster } from 'react-hot-toast'
//import { FaPlus } from 'react-icons/fa6'
//import { url } from '../../../utils/serverUrl'
//import PostCardAdmin from '../../../components/admin/postCardAdmin'
//import AnimatedLayout from '../../animation/animatedLayout'
//import ProductCard from '../../components/productCard'

//THIS IS THE CUSTOM HOOK

const usePrevLocation = (location) => {

    const prevLocRef = useRef(location)
    
    useEffect(()=>{
    
    prevLocRef.current = location
    
    },[location])
    
    return prevLocRef.current
    
    }

export default function InfiniteEntity({
  loaderRoute,
  fetchMoreURL,
  UnitEntity,
}) {

  const fetcher = useFetcher()
  const [items, setItems] = useState([])
  const [cursor, setCursor] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [rerender, setRerender] = useState(true)
  const prevLoader = usePrevLocation(loaderRoute)

  useEffect(() => {
    if ((!fetcher.data && fetcher.state === 'idle') || prevLoader !== loaderRoute) {
      fetcher.load(loaderRoute)
    }
    const toastOptions = {duration: 5000}
    if (fetcher.data && fetcher.data.msg) {
      toast.success(fetcher.data.msg, toastOptions);
    } else if (fetcher.data && fetcher.data.error) {
      toast.error(fetcher.data.error, toastOptions);
    }
    if (fetcher.data && items.length === 0) setItems(fetcher.data)
    cursor ? fetchMoreData() : ''
    console.log(cursor)
  }, [cursor, rerender,fetcher.data,loaderRoute])

  const fetchMoreData = async () => {
    let completeUrl = fetchMoreURL + `?cursor=${cursor || ''}&limit=${5}`
    if (fetchMoreURL.includes('?')) {
      completeUrl = fetchMoreURL + `&cursor=${cursor || ''}&limit=${5}`
    }
    //console.log(completeUrl)
    try {
        const token = localStorage.getItem("token");
      const response = await fetch(
       completeUrl,
        {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
             Authorization: `Bearer ${token}`,

           },
        }
      )
      const moreItems = await response.json()
      console.log(moreItems)
      moreItems.length > 0 ? setHasMore(true) : setHasMore(false)
      setItems((prevItems) => [...prevItems,...moreItems])

      //moreItems.length > 0 ? setHasMore(true) : setHasMore(false)
      console.log(hasMore)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="flex justify-center items-center w-full">
        <Toaster/>
      {items.length > 0 ? (
        <InfiniteScroll
          dataLength={items.length || 0}
          hasMore={hasMore}
          next={() => setCursor(items[items.length - 1]._id)}
         
          loader={
            <div className='w-full flex justify-center'>
              <span className="loading loading-ball mx-auto loading-lg"></span>
            </div>
          }
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b className="">Yay! Vous avez tout vue</b>
            </p>
          }
        >
         
            {items.map((item) => (
              <UnitEntity item={item} key={item._id} />
            ))}
          
        </InfiniteScroll>
      ) : (
        <p className="text-center text-white">No Data</p>
      )}
    </div>
  )
}
