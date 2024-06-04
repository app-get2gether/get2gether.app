import useSWR from "@/hooks/useSWR";

const useUser = () => {
  const { data, isLoading, error } = useSWR("/tgbot/v1/me");

  return {
    user: data,
    error,
    isLoading,
  };
};

export default useUser;
