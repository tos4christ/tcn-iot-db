const settings = {
    graphql: {
      uri: "http://localhost:5001/api/graphql",
    },
    meta: {
      rootUrl: "http://localhost:5000",
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
      url: "ws://127.0.0.1:3000/websockets"
    }
  };
  
  export default settings;
  