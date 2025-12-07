import { useSelector } from "react-redux";

function Button({ label, onClick }: { label: string; onClick: () => void }) {
  const count = useSelector((state: any) => state?.user?.count) ?? 0;
  return (
    <button 
      onClick={onClick} 
      style={{ padding: '10px 20px', cursor: 'pointer' }}
    >
      {label}: {count}
    </button>
  )
}

export default Button
