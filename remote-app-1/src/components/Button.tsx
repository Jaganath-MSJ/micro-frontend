import { useSelector } from "react-redux";

const loadSharedUtils = async () => {
  const utils = await import("shared-utils/utils");
  return utils;
};

function Button({ label, onClick }: { label: string; onClick: () => void }) {
  const count =
    useSelector((state: { user: { count: number } }) => state?.user?.count) ??
    0;

  const onCheckUtils = async () => {
    onClick();
    const data = (await loadSharedUtils()).getUserMessage();
    console.log("haiiia aa", data);
  };

  return (
    <button
      onClick={onCheckUtils}
      style={{ padding: "10px 20px", cursor: "pointer" }}
    >
      {label}: {count}
    </button>
  );
}

export default Button;
