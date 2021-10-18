import "./App.css";
import EventList from "./components/EventList";
import { allEventsType, retrieveData } from "./ColonyClient";
import { useEffect, useState } from "react";

function App() {
  const [dataFetched, setDataFetched] = useState(false);
  const [data, setData] = useState<allEventsType[]>([]);
  useEffect(() => {
    retrieveData().then((retrievedData) => {
      setData(retrievedData);
      setDataFetched(true);
    });
  }, []);
  return (
    <div>
      {dataFetched ? (
        <EventList data={data} />
      ) : (
        <div className="loadingMessgeWrapper">
          <div className="loadingMessageContainer">
            <div className="loadingMessage">Data is currently being loaded, it will take from 30 seconds to a few minutes. Please be patient!</div>
            <div id="loading"></div>
          </div>

        </div>
      )}
    </div>
  );
}

export default App;
