import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import PageWrapper from "@/components/layout/PageWrapper";
import NavbarSettings from "@analysis/components/NavbarSettings";

import * as styles from "./index.module.css";

const Analysis = lazy(() => import("./pages/Analysis"));

import "@/i18n";
import "@/index.css";

const root = ReactDOM.createRoot(
    document.querySelector(".root")!
);

function App() {
    return <BrowserRouter>
        <PageWrapper
            className={styles.wrapper}
        >
            <Suspense fallback={<div className={styles.loading}>Loading…</div>}>
                <Routes>
                    <Route path="*" element={<Analysis/>} />
                </Routes>
            </Suspense>
        </PageWrapper>
        <NavbarSettings/>
    </BrowserRouter>;
}

root.render(<App/>);