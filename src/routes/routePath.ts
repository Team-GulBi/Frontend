const RoutePath = {
    Main: "/",

    ProductCreate: "/product",
    ProductEdit: "/product/:id/edit",
    ProductView: "/product/:id",

    Chat: "/chat",

    Login: "/login",

    Signup: "/signup",
    Onboarding: "/signup/profile",

    MyPage: "/profile",

    Search: "/search",

    Contract: "/contract",
    ContractInput: "/contract/Input",
    ContractCompleted: "/contract/Completed",
  } as const;
  
  export default RoutePath;