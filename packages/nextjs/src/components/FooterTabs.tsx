import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";
import { UserIcon, CalendarDaysIcon, WalletIcon, MapIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

import cn from "classnames";

const MenuLinks = [
  {
    href: "/tgbot/events",
    title: "Events",
    icon: <CalendarDaysIcon />,
  },
  {
    href: "/tgbot/map",
    title: "Map",
    icon: <MapIcon />,
  },
  {
    href: "/tgbot/wallet",
    title: "Wallet",
    icon: <WalletIcon />,
  },
  {
    href: "/tgbot/profile",
    title: "Profile",
    icon: <UserIcon />,
  },
  {
    href: "/tgbot/profile",
    title: "Help",
    icon: <QuestionMarkCircleIcon />,
  },
];

export default function FooterTabs({ className }: { className?: string }) {
  return (
    <footer className={twMerge("footer pb-2 bg-base-100 h-24 border-base-300 border-t flex items-center", className)}>
      <div className="w-full flex flex-row">
        {MenuLinks.map(({ href, title, icon }, i) => (
          <FooterItem href={href} title={title} icon={icon} key={i} />
        ))}
      </div>
    </footer>
  );
}

function FooterItem({ href, title, icon, key }: { href: string; title: string; icon: React.ReactNode; key: number }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={cn("flex-1 text-center", { "text-primary": isActive })} key={key}>
      <span className="w-6 h-6 block mx-auto my-1">{icon}</span>
      <span className="text-sm">{title}</span>
    </Link>
  );
}
