"use client";

import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";
import { UserIcon, CalendarDaysIcon, WalletIcon, BoltIcon } from "@heroicons/react/24/outline";

import cn from "classnames";
import { useTranslation } from "react-i18next";

const MenuLinks = [
  {
    href: "/tgbot/events",
    title: "footer_tabs.events",
    icon: <CalendarDaysIcon />,
  },
  {
    href: "/tgbot/events/my",
    title: "footer_tabs.my_events",
    icon: <BoltIcon />,
  },
  {
    href: "/tgbot/profile",
    title: "footer_tabs.profile",
    icon: <UserIcon />,
  },
];

export default function FooterTabs({ className }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <footer
      className={twMerge(
        "footer pb-2 px-3 bg-base-100 h-24 border-base-300 border-t flex items-center touch-none",
        className,
      )}
    >
      <div className="w-full flex flex-row">
        {MenuLinks.map(({ href, title, icon }, i) => (
          <FooterItem href={href} title={t(title)} icon={icon} key={i} />
        ))}
      </div>
    </footer>
  );
}

function FooterItem({ href, title, icon, key }: { href: string; title: string; icon: React.ReactNode; key: number }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={cn("flex-1 text-center animated-on-press", { "text-primary": isActive })} key={key}>
      <span className="w-6 h-6 block mx-auto my-1">{icon}</span>
      <span className="text-sm">{title}</span>
    </Link>
  );
}
