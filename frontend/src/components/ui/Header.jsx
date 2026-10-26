import { CiLogin } from "react-icons/ci";


export function Header({handleLogout}) {
    return (
        <>
        <nav className="w-screen bg-secondary absolute top-0 flex justify-between px-10 py-2 shadow-sm">
            <div className="flex justify-center items-center font-bold text-xl">
                <h1>Dulce Esencia</h1>
            </div>

            <ul>
                <li></li>
                <div className="bg-danger font-bold gap-2 px-3 py-1 rounded hover:scale-105 cursor-pointer transition-all ease-in-out flex justify-center items-center text-center text-white" onClick={handleLogout}> <p>Cerrar sesion</p><CiLogin  size="20" color="white" /></div>
            </ul>
        </nav>
        </>
    )
}

export default Header;