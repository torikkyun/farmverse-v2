import Image from "next/image";

interface DungItem {
  id: number;
  image: string;
  name: string;
  price: number;
  description?: string;
  type?: string;
  quantity?: number;
}

interface DungCardProps {
  dungs: DungItem;
  selected: boolean;
  onSelect: (id: string) => void;
}

export default function DungCard({ dungs, selected, onSelect }: DungCardProps) {
  return (
    <div
      className={`group bg-white border rounded-2xl p-0 flex flex-col items-stretch text-black relative overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200
        ${selected ? "border-black ring-2 ring-black" : "border-black/10"}
        h-full
      `}
    >
      <div className="relative">
        <Image
          src={dungs.image}
          alt={dungs.name}
          width={150}
          height={150}
          className="w-full aspect-[1/1] object-cover rounded-t-2xl border-b border-black/10 transition-all duration-200 group-hover:scale-105 bg-black"
          priority
        />
        <button
          onClick={() => onSelect(String(dungs.id))}
          className={`absolute top-3 right-3 rounded-full w-9 h-9 flex items-center justify-center transition-all duration-200 shadow-lg
            ${
              selected
                ? "bg-black text-white opacity-100"
                : "bg-black/80 text-white opacity-0 group-hover:opacity-100 hover:bg-black"
            }
          `}
          title={selected ? "Bỏ chọn" : "Thêm vào giỏ hàng"}
          style={{ zIndex: 20, fontSize: 22 }}
        >
          +
        </button>
      </div>
      <div className="flex-1 flex flex-col px-4 py-3 gap-1">
        <div className="font-bold text-base truncate">{dungs.name}</div>
        <div className="text-black text-sm">
          Số lượng: {dungs.quantity ?? 1}
        </div>
        <div className="font-bold text-base">Giá: {dungs.price} FVT</div>
      </div>
    </div>
  );
}
