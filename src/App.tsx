import "./App.css";
import EventList from "./components/EventList";
import { allEventsType, retrieveData } from "./ColonyClient";
import { useEffect, useState } from "react";

function App() {
  const [dataFetched, setDataFetched] = useState(false);
  const [data, setData] = useState<allEventsType[]>([]);
  useEffect(() => {
    retrieveData().then((retrievedData) => {
      console.log(retrievedData);
      setData(retrievedData);
      setDataFetched(true);
    });
  }, []);
  return (
    <div>
      {dataFetched ? <EventList data={data} /> : <div>Data loading</div>}
    </div>
  );
}

export default App;
