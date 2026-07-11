"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAppSelector } from "@/store/hooks";
import { UserService } from "@/services/api";
import { UI_CONTENT } from "@/constants/uiContent";

export function ProfilePage() {
  const { token } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    UserService.profile()
      .then((response) => {
        if (response.data.success) {
          setData((prev) => ({
            ...prev,
            name: response.data.data.name,
            email: response.data.data.email,
          }));
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(() => {
        if (!token) {
          router.push("/");
        } else {
          toast.error("Failed to load profile");
        }
      });
  }, [token, router]);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await UserService.updateProfile({
        name: data.name,
        password: data.password,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setData((prev) => ({ ...prev, password: "" }));
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error("An error occurred while updating profile");
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 min-h-[60vh]">
      <form
        onSubmit={onSubmitHandler}
        className="max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {UI_CONTENT.PROFILE.TITLE}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {UI_CONTENT.PROFILE.NAME_LABEL}
            </label>
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder={UI_CONTENT.PROFILE.NAME_PLACEHOLDER}
              required
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {UI_CONTENT.PROFILE.EMAIL_LABEL}
            </label>
            <input
              name="email"
              value={data.email}
              type="email"
              placeholder={UI_CONTENT.PROFILE.EMAIL_PLACEHOLDER}
              disabled
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/50 px-4 py-3 text-zinc-500 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {UI_CONTENT.PROFILE.PASSWORD_LABEL}
            </label>
            <input
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              type="password"
              placeholder={UI_CONTENT.PROFILE.PASSWORD_PLACEHOLDER}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 py-3 font-semibold text-white transition-colors"
        >
          {UI_CONTENT.PROFILE.UPDATE_BUTTON}
        </button>
      </form>
    </div>
  );
}
