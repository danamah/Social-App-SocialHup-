import { createContext, useState } from "react"

export const authContext = createContext()

export default function AuthContextProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("userToken"))

    return (
        <>
            <authContext.Provider value={{token,setToken}}>
                {children}
            </authContext.Provider>

        </>
    )
}
