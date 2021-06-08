import { ExplorerLink } from "components/ExternalLink";
import { observer } from "mobx-react-lite";
import { store } from "models/Store";
import React from "react";
import { BiAnchor as Anchor } from "react-icons/bi";
import Jazzicon from "react-jazzicon";
import { Link, useLocation } from "react-router-dom";
import { FlowIcon, SolanaIcon } from "./CustomIcons";

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Sidebar = observer(() => {
  const { pathname } = useLocation();

  const navigation = [
    {
      name: "Flow Editor",
      href: "/",
      icon: FlowIcon,
      current: pathname === "/",
    },
    {
      name: "Anchor",
      href: "/anchor",
      icon: Anchor,
      current: pathname === "/anchor",
    },
  ];

  const secondaryNavigation = [
    {
      name: "Solana",
      href: "/settings/solana",
      icon: SolanaIcon,
      current: pathname === "/settings/solana",
    },
  ];

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col">
        <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-gray-100">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1" aria-label="Sidebar">
              <div className="px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-200 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                    )}
                    // aria-current={item.current ? "page" : undefined}
                  >
                    <item.icon
                      className={classNames(
                        item.current
                          ? "text-gray-500"
                          : "text-gray-400 group-hover:text-gray-500",
                        "mr-3 flex-shrink-0 h-6 w-6"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </div>
              <hr
                className="border-t border-gray-200 my-5"
                aria-hidden="true"
              />
              <div className="flex-1 px-2 space-y-1">
                {secondaryNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    // className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                    className={classNames(
                      item.current
                        ? "bg-gray-200 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                    )}
                  >
                    <item.icon
                      // className="text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-6 w-6"
                      className={classNames(
                        item.current
                          ? "text-gray-500"
                          : "text-gray-400 group-hover:text-gray-500",
                        "mr-3 flex-shrink-0 h-6 w-6"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}

                    {item.name === "Solana" && (
                      <span className="ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 text-solanaGreen rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-activity mr-2"
                        >
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                        </svg>
                        {store.cluster}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <a href="#" className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <Jazzicon diameter={40} seed={store.userPublicKey} />

                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-100">
                    {store.shortUserPublicKey}
                  </p>
                  <ExplorerLink
                    className="text-xs font-medium text-gray-500 group-hover:text-gray-200"
                    path={`address/${store.userPublicKey}`}
                  >
                    View on explorer
                  </ExplorerLink>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});
