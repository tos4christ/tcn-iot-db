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
      url: "wss://127.0.0.1:3001/websockets"
    }
  };
  
  export default settings;
  