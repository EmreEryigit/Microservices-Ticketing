import React from "react";
import Link from "next/link";
import SignUpPage from "../pages/auth/signup";
import styles from '../styles/Header.module.css'
const Header = ({ currentUser }: { currentUser: CurrentUser }) => {
    const links = [
        !currentUser && { label: "Sign Up", href: "/auth/signup" },
        !currentUser && { label: "Sign In", href: "/auth/signin" },
        currentUser && { label: "Sell Tickets", href: "/tickets/new" },
        currentUser && { label: "My Orders", href: "/orders" },
        currentUser && { label: "Sign Out", href: "/auth/signout" },
    ]
        .filter((linkConfig) => linkConfig)
        .map((item) => {
            if (typeof item !== "boolean") {
                return (
                    <li className={styles.navItem} key={item.href}>
                        <Link href={item.href}>
                            <a className="nav-link"> {item.label}</a>
                        </Link>
                    </li>
                );
            }
        });
    return (
        <nav className={styles.navbar}>
            <Link href="/">
                <a className="navbar-brand">Get Tickets</a>
            </Link>
            <div className="">
                <ul className={styles.linkNav}>{links}</ul>
            </div>
        </nav>
    );
};

export default Header;
