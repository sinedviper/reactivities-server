import { observer } from "mobx-react-lite";
import { Outlet, useLocation } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";

import NavBar from "./NavBar";
import HomePage from "../../features/home/HomePage.tsx";
import { useStore } from "../stores/store.ts";
import LoadingComponent from "./LoadingComponent.tsx";
import ModalContainer from "../common/modal/ModalContainer.tsx";

function App() {
  const location = useLocation();
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);

  if (!commonStore.appLoaded)
    return <LoadingComponent content={"Loading activities..."} />;

  return (
    <>
      <ModalContainer />
      <ToastContainer
        position={"bottom-right"}
        hideProgressBar
        theme={"colored"}
      />
      {location.pathname === "/" ? (
        <HomePage />
      ) : (
        <>
          <NavBar />
          <Container style={{ marginTop: "7em" }}>
            <Outlet />
          </Container>
        </>
      )}
    </>
  );
}

export default observer(App);
