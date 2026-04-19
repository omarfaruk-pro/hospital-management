import Header from "./component/Header";


export default function BasicLayout({ children }) {
    return (
        <>
            <Header />
            {children}
        </>
    )
}
