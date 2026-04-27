import LoggedIn from "../component/LoggedIn";
import Header from "./component/Header";


export default function BasicLayout({ children }) {
    return (
        <>
            <Header />
            <LoggedIn />
            {children}
        </>
    )
}
