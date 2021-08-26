(async () => {
  /********BE CAREFUL WHAT YOU DELETE BELOW THIS LINE********/

  // Get the configuration information from the config.js file
  const config = await await fetch("config").then(response => response.json());

  // Create a JWT token for authenticating the user to a QCS session
  const token = await await fetch("token").then(response => response.json());

  const login = await await fetch(
    `https://${config.tenantDomain}/login/jwt-session?qlik-web-integration-id=${config.qlikWebIntegrationId}`,
    {
      method: "POST",
      credentials: "include",
      mode: "cors",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token.token}`,
        "qlik-web-integration-id": config.qlikWebIntegrationId
      },
      rejectunAuthorized: false
    }
  );

  //Get the cross-site scripting token to allow requests to QCS from the web app
  const csrfTokenInfo = await await fetch(
    `https://${config.tenantDomain}/api/v1/csrf-token?qlik-web-integration-id=${config.qlikWebIntegrationId}`,
    {
      credentials: "include",
      headers: {
        "Qlik-Web-Integration-ID": config.qlikWebIntegrationId
      }
    }
  );

  // Build the websocket URL to connect to the Qlik Sense applicaiton
  const url = `wss://${config.tenantDomain}/app/${
    config.appId
  }?qlik-web-integration-id=${
    config.qlikWebIntegrationId
  }&qlik-csrf-token=${csrfTokenInfo.headers.get("qlik-csrf-token")}`;

  // Fetch the schema for communicating with Qlik's engine API
  const schema = await (await fetch(
    "https://unpkg.com/enigma.js/schemas/3.2.json"
  )).json();

  // Create Qlik engine session
  const session = window.enigma.create({ schema, url });

  // Open the application
  const app = await (await session.open()).openDoc(config.appId);

  /********BE CAREFUL WHAT YOU DELETE ABOVE THIS LINE********/

  const themeFile = await await fetch("theme/horizon").then(response =>
    response.json()
  );
  console.log(themeFile);

  // Create embed configuration
  const nuked = window.stardust.embed(app, {
    context: { theme: "dark" },
    types: [
      {
        name: "action-button",
        load: () => Promise.resolve(window["sn-action-button"])
      },
      {
        name: "scatterplot",
        load: () => Promise.resolve(window["sn-scatter-plot"])
      }
    ]
  });

  (await nuked.selections()).mount(document.querySelector(".toolbar"));

  nuked.render({
    element: document.querySelector(".object"),
    type: "scatterplot",
    fields: [
      {
        qDef: {
          qFieldDefs: ["FID"],
          qFieldLabels: ["FID"]
        },
        qAttributeDimensions: [
          {
            qDef:
              "=pick(aggr(KMeans2D(vDistClusters, only(Lat), only(Long)), FID)+1, 'Cluster 1', 'Cluster 2', 'Cluster 3', 'Cluster 4', 'Cluster 5')",
            qAttribute: true,
            id: "colorByAlternative",
            label: "Cluster id"
          }
        ]
      },
      "=Avg(Lat)",
      "=Avg(Long)"
    ],
    properties: {
      title: "k-Means clustering",
      color: {
        auto: false,
        mode: "byDimension",
        byDimDef: {
          type: "expression",
          key:
            "=pick(aggr(KMeans2D(vDistClusters, only(Lat), only(Long)), FID)+1, 'Cluster 1', 'Cluster 2', 'Cluster 3', 'Cluster 4', 'Cluster 5')",
          label: "Cluster id"
        }
      }
    }
  }),
    nuked.render({
      element: document.querySelector(".object"),
      type: "scatterplot",
      id: "PAY"
    }),
    nuked.render({
      element: document.querySelector(".object_new"),
      type: "action-button",
      id: "KrJ"
    }),
    nuked.render({
      element: document.querySelector(".object_new"),
      type: "action-button",
      id: "HLmCEm"
    }),
    nuked.render({
      element: document.querySelector(".object_new"),
      type: "action-button",
      id: "pqdVPm"
    });
})();
