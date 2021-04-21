import React, { useState } from "react";
import { Button } from "reactstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { getConfig } from "../../config";

const ToggleButton = (props) => {
  const { apiOrigin = "http://localhost:3001" } = getConfig();

  const [state, setState] = useState({
    toggle: props.value,
    name: props.name,
  });

  const { getAccessTokenSilently } = useAuth0();

  const toggleSwitch = async () => {
    try {
      const token = await getAccessTokenSilently();

      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: state.name,
          value: state.toggle,
        }),
      };

      const response = await fetch(`${apiOrigin}/api/manage/change`, options);
      const responseData = await response.json();

      if (responseData.status === "ok") {
        setState({ ...this.state, toggle: !this.state.toggle });
      }
    } catch (error) {}
  };

  return <Button onClick={toggleSwitch}>Toggle</Button>;
};

export default ToggleButton;
