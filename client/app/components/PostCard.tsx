import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import { Link } from 'react-router'
import { serverUrl } from '~/utils/serverUrl'

export default function PostCard({item}){
    return (<div className="flex flex-col lg:flex-row m-5 p-5 intersect:motion-delay-[500ms] intersect:motion-opacity-in-0 intersect:motion-translate-y-in-100 intersect:motion-blur-in-md">
        <div className='mr-5'>
            <Link to={`/singlePost/${item._id}`}>
            <img src={serverUrl+"/"+item.cover} className="max-w-sm rounded-2xl lg:w-lg hover:scale-105 transition-all duration-300" />
            </Link> 
        </div>
        <div className='flex flex-col gap-5 my-3'>
        <Link to={`/category/${item.category}`}><span className='badge badge-primary rounded-full'> {item.category} </span></Link>
            <Link to={`/singlePost/${item._id}`}> <h1 className='text-2xl lg:text-5xl font-bold hover:underline transition-all duration-300'> {item.title} </h1></Link>
            <p> {formatDistance(new Date(item.updatedAt), new Date(), { addSuffix: true })} </p>
        </div>
    </div>)
}