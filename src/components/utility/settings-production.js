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
    websockets: {
      url: "wss://102.89.11.82:443/websockets"
    }
  };
  
  export default settings;
  