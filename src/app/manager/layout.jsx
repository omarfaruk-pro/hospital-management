import ManagerSideBar from "./ManagerSideBar";


export default function ManagerLayout({ children }) {
    return (
        <>
            <ManagerSideBar />
            {children}
        </>
    )
}
