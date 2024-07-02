import { useState } from "react"


const useFetch = (cb, options = {}) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    
    // console.log("Printing cb -> ",cb)
    const fn = async (...args) => {
        setLoading(true);
        setError(null);
        // console.log("I'm in useFetch hook")
        try {
            const response = await cb(options, ...args);
            // console.log("Printing response in custom hook -> ",response)
            setData(response);
            setError(null)
        } catch (error) {
            // console.log("I'm in catch block of useFetch")
            setError(error)
        } finally {
            setLoading(false);
        }
    }
    // console.log("Printing all data in useFetch -> ",data, loading, error,fn)
    return {data, loading, error, fn}
}

export default useFetch