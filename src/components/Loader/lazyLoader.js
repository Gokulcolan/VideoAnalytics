import React, { Suspense, useEffect, useState } from "react";
import { Backdrop } from "@mui/material";
// import "../comp.css";
const LazyLoader = ({ children }) => {
  return <Suspense fallback={<SectionLoader/>}>{children}</Suspense>;
};

const SectionLoader = () => {
  const [showLoader, setShowLoader] = useState(true);
  useEffect(() => {
    
    const timeoutId = setTimeout(() => {
      setShowLoader(false);
    }, 2500);

    return () => {
      // Clear the timeout if the component unmounts before 300ms
      clearTimeout(timeoutId);
    };
  }, []); // Run the effect only once when the component mounts
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      open={showLoader}
    >
      <div
        className="loader__wrap"
        role="alertdialog"
        aria-busy="true"
        aria-live="polite"
        aria-label="Loading…"
      >
        <div className="spinner"></div>
      </div>
    </Backdrop>
  );
};

export default LazyLoader;
