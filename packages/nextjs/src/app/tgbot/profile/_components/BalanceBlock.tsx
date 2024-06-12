import { twMerge } from "tailwind-merge";
import Image from "next/image";
import useDefaultImage from "@/hooks/useDefaultImage";
import { TonConnectButton } from "@tonconnect/ui-react";

export default function BalanceBlock({ className, funds }: { className?: string; funds: number }) {
  const defaultImageUrl = useDefaultImage();

  return (
    <div className={twMerge("w-full", className)}>
      <div className="border border-base-300 rounded-xl p-5">
        <div>
          <TonConnectButton />
        </div>

        <div className="divider" />

        <div className="flex flex-row">
          <div className="avatar">
            <div className="rounded-full w-12">
              <Image src={defaultImageUrl} alt="avatar" fill={true} />
            </div>
          </div>
          <div className="ml-3">
            <div className="font-bold">Get2Gether Event Token</div>
            <div className="opacity-50">GET</div>
          </div>
        </div>

        <div className="divider" />

        <div className="text-5xl">{funds}</div>
      </div>
    </div>
  );
}
