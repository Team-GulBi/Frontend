import { RouterProvider } from "react-router-dom";
import Router from "@/routes/router";
import ReactQuerySetting from "./libraries/reactQuery/ReactQuerySetting";

function App() {
  return (
    <ReactQuerySetting>
      <RouterProvider router={Router} fallbackElement={<div>Loading...</div>} />
    </ReactQuerySetting>
  );
}

export default App;