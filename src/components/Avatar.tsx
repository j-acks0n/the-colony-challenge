import "./Avatar.css";
import Blockies from "react-blockies";
type AvatarType = {
  userAddress: string;
};

const Avatar = ({ userAddress }: AvatarType) => {
  return (
    <div className="avatarContainer">
      <Blockies seed={userAddress} size={10} scale={3.7} className="avatar" />
    </div>
  );
};

export default Avatar;
