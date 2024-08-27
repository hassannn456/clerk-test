import React from "react";
import useClerkRoutes from "./components/hooks/routes";

function App() {
  return (
    <>
      <div id="back-to-top-anchor"></div> 
      <main>{useClerkRoutes()}</main>
    </>
  );
}

export default App;
