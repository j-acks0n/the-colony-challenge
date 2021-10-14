import Avatar from "./Avatar";
import "./ListItem.css";

type listItemType = {
  classBorder: String;
};

const ListItem = ({ classBorder }: listItemType) => {
  return (
    <div className={`listItemContainer ${classBorder}`}>
      <Avatar />
      <div className="listItemText">
        <span className="copyPrimary copyRegular">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. At, expedita
          aliquid. Pariatur enim nobis aliquam necessitatibus eligendi incidunt
          vitae tempora veritatis suscipit, ipsum nostrum non maxime fuga ullam
          iste ipsa?
        </span>
        <br />
        <span className="copySecondary caption copyRegular">19th Aug</span>
      </div>
    </div>
  );
};

export default ListItem;
