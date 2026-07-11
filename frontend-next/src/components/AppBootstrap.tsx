"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCart } from "@/store/slices/cartSlice";
import { fetchFoodList } from "@/store/slices/foodSlice";

export function AppBootstrap() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    dispatch(fetchFoodList());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(fetchCart());
    }
  }, [dispatch, token]);

  return null;
}
