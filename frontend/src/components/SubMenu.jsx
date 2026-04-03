import { useEffect, useRef, useState } from "react"


const SubMenu = ({ isOpen, children }) => {

    const ref = useRef()
    const [height, setHeight] = useState(0)

    useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.scrollHeight)
        }
    }, [children, isOpen])
    return (
        <ul
            ref={ref}
            style={{
                height: isOpen ? height : 0,
            }}
            className="ml-4 overflow-hidden transition-all duration-300 ease-in-out"
        >
            {children}
        </ul>
    )
}

export default SubMenu