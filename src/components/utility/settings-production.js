const settings = {
    graphql: {
      uri: "",
    },
    meta: {
      rootUrl: "",
      title: "App",
      description: "The app description goes here.",
    },
    routes: {
      authenticated: {
        pathAfterFailure: "/login",
      },
      public: {
        pathAfterFailure: "/documents",
      },
    },
  };
  
  export default settings;
  