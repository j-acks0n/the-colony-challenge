import "./EventList.css";
import ListItem from "./ListItem";

const EventList = () => {
  return (
    <div className="eventList">
      {Array.from(Array(10), (e, i) => {
        return <ListItem classBorder={`${i === 0 ? "listItemContainerTopBorder" : i === 9 ? "listItemContainerBottomBorder" : "listItemContainerNoBorder"}`}/>;
      })}
    </div>
  );
};

export default EventList;
