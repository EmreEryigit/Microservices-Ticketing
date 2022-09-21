import { MantineProvider } from "@mantine/core";
import { NextPageContext } from "next";
import { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { Context } from "vm";
import buildClient from "../api/build-client";
import Header from "../components/Header";
import "../styles/globals.css";

interface AppPropsWithCurrentUser {
    Component: AppProps["Component"];
    pageProps: AppProps["pageProps"];
    currentUser: CurrentUser;
}

const AppComponent = ({
    Component,
    pageProps,
    currentUser,
}: AppPropsWithCurrentUser) => {
    return (
        <>
            <Head>
                <title>Page title</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>

            <MantineProvider
        
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    /** Put your mantine theme override here */

                    colorScheme: "dark",
                    
                }}
            >
                <div>
                    <Header currentUser={currentUser} />
                    <div className="container">
                        <Component currentUser={currentUser} {...pageProps} />
                    </div>
                </div>
            </MantineProvider>
        </>
    );
};

AppComponent.getInitialProps = async (appContext: AppContext) => {
    // app Context is different from context
    const client = buildClient(appContext.ctx); // !!!
    const { data } = await client.get("/api/users/currentuser");

    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(
            appContext.ctx,
            // @ts-ignore
            client,
            data.currentUser
        );
    }

    return {
        pageProps,
        ...data,
    };
};

export default AppComponent;
