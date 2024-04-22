"use client";
import { usePathname, useSearchParams } from "next/navigation";

const useUrlHelpers = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const removeQueryParam = (param: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete(param);
    const search = current.toString();
    const query = search ? `?${search}` : "";

    return `${pathname}${query}`;
  };

  const getNewUrlParams = (newSearchParams: string, path?: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    const postfix = newSearchParams.split("#");
    const params = postfix[0]?.split("&");
    const id = postfix[1];

    if (params && params.length > 0) {
      params.forEach((param) => {
        const [name, newValue] = param.split("=");
        if (!name || !newValue) return;
        current.set(name, newValue);
      });
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    const selectedId = id ? `#${id}` : "";

    return `${path ? path : pathname}${query}${selectedId}`;
  };

  return { getNewUrlParams, removeQueryParam };
};

export default useUrlHelpers;
