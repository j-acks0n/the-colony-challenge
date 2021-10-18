import { allEventsType } from "../ColonyClient";
import Avatar from "./Avatar";
import "./ListItem.css";

type itemType = allEventsType;

type listItemType = {
  classBorder: String;
  item: itemType;
};

const ListItem = ({ classBorder, item }: listItemType) => {
  const primary = item.primary;
  const secondary = item.secondary;
  const eventType = item.eventType;
  let primaryText;
  const secondaryText = secondary;
  if (eventType === "ColonyInitialised") {
    primaryText = <>Congratulations! It's a beautiful baby colony!</>;
  } else if (eventType === "ColonyRoleSet") {
    const role = primary.role;
    const userAddress = primary.userAddress;
    const domainId = primary.domainId;
    primaryText = (
      <>
        <span className="copyHeavy">{role}</span> role assigned to user <span className="copyHeavy">{userAddress}</span> in domain <span className="copyHeavy">{domainId}</span>.
      </>
    );
  } else if (eventType === "PayoutClaimed") {
    const userAddress = primary.userAddress;
    const amount = primary.amount;
    const token = primary.token;
    const fundingPotId = primary.fundingPotId;
    primaryText = (
      <>
        User <span className="copyHeavy">{userAddress}</span> claimed <span className="copyHeavy">{amount}${token}</span> payout from pot <span className="copyHeavy">{fundingPotId}</span>.
      </>
    );
  } else if (eventType === "DomainAdded") {
    const domainId = primary.domainId;
    primaryText = <>Domain <span className="copyHeavy">{domainId}</span> added.</>;
  }

  return (
    <div className={`listItemContainer ${classBorder}`}>
      <Avatar
        userAddress={
          primary.userAddress
            ? primary.userAddress
            : "0x05192ae9883dd783663fcee7cde3d52f9c126649"
        }
      />
      <div className="listItemText">
        <span className="copyPrimary copyRegular primaryText">{primaryText}</span>
        <br />
        <span className="copySecondary caption copyRegular">
          {secondaryText}
        </span>
      </div>
    </div>
  );
};

export default ListItem;
