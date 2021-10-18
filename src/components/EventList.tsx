import { useState } from "react";
import { allEventsType } from "../ColonyClient";
import "./EventList.css";
import ListItem from "./ListItem";

type EventListType = {
  data: allEventsType[];
};
const EventList = ({ data }: EventListType) => {
  const [currentDataLength, setCurrentDataLength] = useState(
    10 < data.length ? 10 : data.length
  );

  const loadMoreHandler = () => {
    setCurrentDataLength(
      (currentDataLength + 30) < data.length
        ? currentDataLength + 30
        : currentDataLength + (data.length - currentDataLength)
    );
  };
  return (
    <>
      <div className="eventList">
        {data.slice(0, currentDataLength).map((item, i) => {
          return (
            <ListItem
              key={i}
              item={item}
              classBorder={`${
                i === 0
                  ? "listItemContainerTopBorder"
                  : i === data.length
                  ? "listItemContainerBottomBorder"
                  : "listItemContainerNoBorder"
              }`}
            />
          );
        })}
      </div>
      <div>
        {!(currentDataLength === data.length) && (
          <button className="loadMoreButton " onClick={() => loadMoreHandler()}>
            Load more...
          </button>
        )}
      </div>
    </>
  );
};

export default EventList;
