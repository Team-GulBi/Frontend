const RoutePath = {
    Main: "/",

    ProductCreate: "/product",
    ProductEdit: "/product/edit/:id",
    ProductView: "/product/:id",

    Chat: "/chat",

    Login: "/login",
    Signup: "/signup",

    MyPage: "/profile",
    UserProfile: "/profile/:id",

    Search: "/search",

    Contract: "/contract",
    ContractInput: "/contract/Input",
    ContractCompleted: "/contract/Completed",
  } as const;
  
  export default RoutePath;