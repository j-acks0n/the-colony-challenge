import { allEventsType } from "../ColonyClient";
import "./EventList.css";
import ListItem from "./ListItem";

type EventListType = {
  data: allEventsType[];
};
const EventList = ({ data }: EventListType) => {
  return (
    <div className="eventList">
      {
        data.map((item, i) => {
          return (
            <ListItem
              item = {item}
              classBorder={`${
                i === 0
                  ? "listItemContainerTopBorder"
                  : i === data.length
                  ? "listItemContainerBottomBorder"
                  : "listItemContainerNoBorder"
              }`}
            />
          );
        })
      }
    </div>
  );
};

export default EventList;
