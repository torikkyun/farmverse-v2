import { useEffect, useState } from "react";
import { NFTItem } from "./types";

const PAGE = 1;
const PAGE_SIZE = 10;

interface RawItem {
  id?: string | number;
  _id?: string | number;
  name: string;
  price: number | string;
  images?: string[];
}

export function useFarmItems(API_URL: string, farmId: string) {
  const [items, setItems] = useState<NFTItem[]>([]);
  const [dungs, setDungs] = useState<NFTItem[]>([]);

  useEffect(() => {
    if (!farmId) return;
    const url = `${API_URL}/items/farm/${farmId}?type=TREEROOT&page=${PAGE}&pageSize=${PAGE_SIZE}`;
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        setItems(
          (json?.data?.items || []).map((item: RawItem) => ({
            id: Number(item.id || item._id),
            name: item.name,
            price: Number(item.price), // đảm bảo là number
            image: Array.isArray(item.images) ? item.images[0] : "",
          }))
        );
      })
      .catch(() => setItems([]));
  }, [API_URL, farmId]);

  useEffect(() => {
    if (!farmId) return;
    const url = `${API_URL}/items/farm/${farmId}?type=FERTILIZER&page=${PAGE}&pageSize=${PAGE_SIZE}`;
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        setDungs(
          (json?.data?.items || []).map((item: RawItem) => ({
            id: Number(item.id || item._id),
            name: item.name,
            price: Number(item.price),
            image: Array.isArray(item.images) ? item.images[0] : "",
          }))
        );
      })
      .catch(() => setDungs([]));
  }, [API_URL, farmId]);

  return { items, setItems, dungs, setDungs };
}
