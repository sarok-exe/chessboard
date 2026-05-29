import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

import PageWrapperProps from "./PageWrapperProps";

const queryClient = new QueryClient();

function PageWrapper({
    children,
    className,
    style,
    contentClassName,
    contentStyle,
}: PageWrapperProps) {

    return <QueryClientProvider client={queryClient}>
        <div className={className} style={style}>
            <div className={contentClassName} style={contentStyle}>
                {children}
            </div>
            <ToastContainer/>
        </div>
    </QueryClientProvider>;
}

export default PageWrapper;