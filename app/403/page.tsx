import "@/styles/403.css";
import React from 'react'

const page = () => {
    return (
        <div className="wrapper_access w-full h-full">
            <p>Welcome to 403:</p>
            <h1>Forbidden resource</h1>
            <p>The server understood the request but refuses to authorize it.</p>
        </div>
    )
}

export default page