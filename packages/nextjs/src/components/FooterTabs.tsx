import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";
import { UserIcon, PlusCircleIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

import cn from "classnames";

const MenuLinks = [
  {
    href: "/tgbot/events",
    title: "Events",
    icon: <CalendarDaysIcon />,
  },
  {
    href: "/tgbot/events/create",
    title: "Create",
    icon: <PlusCircleIcon />,
  },
  {
    href: "/tgbot/profile",
    title: "Profile",
    icon: <UserIcon />,
  },
];

export default function FooterTabs({ className }: { className?: string }) {
  return (
    <footer className={twMerge("footer pb-9 pt-2", className)}>
      <div className="w-full flex flex-row text-hint">
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
      <span className="w-7 h-7 block mx-auto my-1">{icon}</span>
      <span>{title}</span>
    </Link>
  );
}
