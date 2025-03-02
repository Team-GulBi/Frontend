import { createBrowserRouter, RouteObject } from "react-router-dom";
import RoutePath from "./routePath";
import MainPage from "@/pages/Main/page";
import ProductCreatePage from "@/pages/Product/Create/page";
import ProductViewPage from "@/pages/Product/View/page";
import ChatPage from "@/pages/Chat/page";
import LoginPage from "@/pages/Auth/Login/page";
import SignupPage from "@/pages/Auth/Signup/page";
import OnboardingPage from "@/pages/Onboarding/page";
import MyPage from "@/pages/Mypage/page";
import SearchPage from "@/pages/Search/page";
import DefaultContractPage from "@/pages/contract/DefaultPage";
import CompletedContractPage from "@/pages/contract/CompletedPage";
import ProductEditPage from "@/pages/Product/Edit/page";

const routes: RouteObject[] = [
  {
    path: RoutePath.Main,
    element: <MainPage />,
  },
  {
    path: RoutePath.ProductCreate,
    children: [
      { index: true, element: <ProductCreatePage /> },
      { path: RoutePath.ProductEdit, element: <ProductEditPage />},
      { path: RoutePath.ProductView, element: <ProductViewPage /> },
    ],
  },
  {
    path: RoutePath.Chat,
    element: <ChatPage />,
  },
  {
    path: RoutePath.Login,
    element: <LoginPage />,
  },
  {
    path: RoutePath.Signup,
    children: [
      { index: true, element: <SignupPage /> },
      { path: RoutePath.Onboarding, element: <OnboardingPage /> },
    ],
  },
  {
    path: RoutePath.MyPage,
    element: <MyPage />,
  },
  {
    path: RoutePath.Search,
    element: <SearchPage />,
  },
  {
    path: RoutePath.Contract,
    children: [
      { path: RoutePath.ContractInput, element: <DefaultContractPage /> },
      { path: RoutePath.ContractCompleted, element: <CompletedContractPage /> },
    ],
  },
];

const Router = createBrowserRouter(routes);

export default Router;