import React, { useState } from "react";
import { Button, Alert } from "reactstrap";
import ToggleButton from "../components/IOT/ToggleButton";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";

export const ManageIotComponent = () => {
  const { apiOrigin = "http://localhost:3001", audience } = getConfig();

  const [state, setState] = useState({
    strip: {
      socket1: false,
      socket2: false,
      socket3: false,
      socketUSB: false,
      currentElectricity: 0,
      currentPower: 0,
      currentVoltage: 0,
    },
    error: null,
  });

  const {
    getAccessTokenSilently,
    loginWithPopup,
    getAccessTokenWithPopup,
  } = useAuth0();

  const handleConsent = async () => {
    try {
      await getAccessTokenWithPopup();
      setState({ ...state, error: null });
    } catch (error) {
      setState({ ...state, error: error.error });
    }

    await fetchStrip();
  };

  const handleLoginAgain = async () => {
    try {
      await loginWithPopup();
      setState({ ...state, error: null });
    } catch (error) {
      setState({ ...state, error: error.error });
    }

    await fetchStrip();
  };

  const fetchStrip = async () => {
    try {
      const token = await getAccessTokenSilently();

      const options = { headers: { Authorization: `Bearer ${token}` } };
      const response = await fetch(`${apiOrigin}/api/manage/status`, options);
      const responseData = await response.json();

      setState({ ...state, strip: responseData.payload });
    } catch (error) {
      setState({ ...state, error: error.error });
    }
  };

  const handle = (e, fn) => {
    e.preventDefault();
    fn();
  };

  return (
    <>
      <div>
        {state.error === "consent_required" && (
          <Alert color="warning">
            You need to{" "}
            <a
              href="#/"
              class="alert-link"
              onClick={(e) => handle(e, handleConsent)}
            >
              consent to get access to users api
            </a>
          </Alert>
        )}

        {state.error === "login_required" && (
          <Alert color="warning">
            You need to{" "}
            <a
              href="#/"
              class="alert-link"
              onClick={(e) => handle(e, handleLoginAgain)}
            >
              log in again
            </a>
          </Alert>
        )}

        {!audience && (
          <Alert color="warning">
            <p>
              You can't call the API at the moment because your application does
              not have any configuration for <code>audience</code>, or it is
              using the default value of <code>YOUR_API_IDENTIFIER</code>. You
              might get this default value if you used the "Download Sample"
              feature of{" "}
              <a href="https://auth0.com/docs/quickstart/spa/react">
                the quickstart guide
              </a>
              , but have not set an API up in your Auth0 Tenant. You can find
              out more information on{" "}
              <a href="https://auth0.com/docs/api">setting up APIs</a> in the
              Auth0 Docs.
            </p>
            <p>
              The audience is the identifier of the API that you want to call
              (see{" "}
              <a href="https://auth0.com/docs/get-started/dashboard/tenant-settings#api-authorization-settings">
                API Authorization Settings
              </a>{" "}
              for more info).
            </p>

            <p>
              In this sample, you can configure the audience in a couple of
              ways:
            </p>
            <ul>
              <li>
                in the <code>src/index.js</code> file
              </li>
              <li>
                by specifying it in the <code>config/auth.json</code> file (see
                the <code>config/auth.json.example</code> file for an example of
                where it should go)
              </li>
            </ul>
            <p>
              Once you have configured the value for <code>audience</code>,
              please restart the app and try to use the "Ping API" button below.
            </p>
          </Alert>
        )}

        <h1>Manage IOT</h1>
        <p className="lead">Manage devices in Melina Krzemowa.</p>

        <Button color="primary" onClick={fetchStrip} disabled={!audience}>
          Refresh
        </Button>
      </div>

      <div className="device-status" data-testid="api-result">
        <div>
          <p>
            Socket 1 - {state.strip.socket1.toString()}
            <ToggleButton name="socket1" value={state.strip.socket1} />
          </p>
          <p>
            Socket 2 - {state.strip.socket2.toString()}
            <ToggleButton name="socket2" value={state.strip.socket2} />
          </p>
          <p>
            Socket 3 - {state.strip.socket3.toString()}
            <ToggleButton name="socket3" value={state.strip.socket3} />
          </p>
          <p>
            Socket USB - {state.strip.socketUSB.toString()}
            <ToggleButton name="socketUSB" value={state.strip.socketUSB} />
          </p>
          <p>
            Current Electricity - {state.strip.currentElectricity.toString()}mA
          </p>
          <p>Current Power - {state.strip.currentPower.toString()}W</p>
          <p>Current Voltage - {state.strip.currentVoltage.toString()}V</p>
        </div>
      </div>
    </>
  );
};

export default withAuthenticationRequired(ManageIotComponent, {
  onRedirecting: () => <Loading />,
});
