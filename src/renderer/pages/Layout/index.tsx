import { FilterIcon, SearchIcon } from "@heroicons/react/solid";
import { observer } from "mobx-react-lite";
import React from "react";
import { BiAnchor as Anchor } from "react-icons/bi";
import { SiEthereum, SiNodeRed } from "react-icons/si";
import Jazzicon from "react-jazzicon";
import { Link, useLocation } from "react-router-dom";
import ExternalLink from "src/renderer/components/ExternalLink";
import { store } from "src/renderer/models/Store";
import { AkashIcon, ArweaveIcon, SolanaIcon } from "./CustomIcons";

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function DirectoryList() {
  const directory = {
    Solana: [
      {
        id: 1,
        name: "Leslie Abbott",
        role: "Co-Founder / CEO",
        imageUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        id: 2,
        name: "Hector Adams",
        role: "VP, Marketing",
        imageUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        id: 3,
        name: "Blake Alexander",
        role: "Account Coordinator",
        imageUrl:
          "https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        id: 4,
        name: "Fabricio Andrews",
        role: "Senior Art Director",
        imageUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
    ],
    Serum: [
      {
        id: 5,
        name: "Angela Beaver",
        role: "Chief Strategy Officer",
        imageUrl:
          "https://images.unsplash.com/photo-1501031170107-cfd33f0cbdcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        id: 6,
        name: "Yvette Blanchard",
        role: "Studio Artist",
        imageUrl:
          "https://images.unsplash.com/photo-1506980595904-70325b7fdd90?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        id: 7,
        name: "Lawrence Brooks",
        role: "Content Specialist",
        imageUrl:
          "https://images.unsplash.com/photo-1513910367299-bce8d8a0ebf6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
    ],
    Utils: [
      {
        id: 9,
        name: "Lawrence Brooks",
        role: "Content Specialist",
        imageUrl:
          "https://images.unsplash.com/photo-1513910367299-bce8d8a0ebf6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
    ],
  };

  return (
    <aside className="hidden xl:order-first xl:flex xl:flex-col flex-shrink-0 w-96 border-r border-gray-200">
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-lg font-medium text-gray-900">Directory</h2>
        <p className="mt-1 text-sm text-gray-600">
          Search directory of 3,018 employees
        </p>
        <form className="mt-6 flex space-x-4" action="#">
          <div className="flex-1 min-w-0">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="search"
                name="search"
                id="search"
                className="focus:ring-pink-500 focus:border-pink-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search"
              />
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex justify-center px-3.5 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            <FilterIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            <span className="sr-only">Search</span>
          </button>
        </form>
      </div>

      <nav className="flex-1 min-h-0 overflow-y-auto" aria-label="Directory">
        {Object.keys(directory).map((letter) => (
          <div key={letter} className="relative">
            <div className="z-10 sticky top-0 border-t border-b border-gray-200 bg-gray-50 px-6 py-1 text-sm font-medium text-gray-500">
              <h3>{letter}</h3>
            </div>
            <ul className="relative z-0 divide-y divide-gray-200 dark:divide-gray-800">
              {directory[letter].map((person) => (
                <li key={person.id}>
                  <div className="relative px-6 py-5 flex items-center space-x-3 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-pink-500">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={person.imageUrl}
                        alt=""
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <a href="#" className="focus:outline-none">
                        {/* Extend touch target to entire panel */}
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-sm font-medium text-gray-900">
                          {person.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {person.role}
                        </p>
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export const Sidebar = observer(() => {
  const { pathname } = useLocation();

  const navigation = [
    {
      name: "Flow Editor",
      href: "/",
      icon: SiNodeRed,
      current: pathname === "/",
    }, // ViewGridAddIcon
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
    {
      name: "Akash",
      href: "#",
      icon: AkashIcon,
    },
    {
      name: "Arweave",
      href: "#",
      icon: ArweaveIcon,
    },
    {
      name: "Ethereum",
      href: "#",
      icon: SiEthereum,
    },
  ];

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-gray-100">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              {/* <img
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/workflow-logo-pink-500-mark-gray-900-text.svg"
            alt="Workflow"
          /> */}
            </div>
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
                  <ExternalLink
                    className="text-xs font-medium text-gray-500 group-hover:text-gray-200"
                    href={`https://explorer.solana.com/address/${store.userPublicKey}?cluster=custom&customUrl=http://localhost:8899`}
                  >
                    View on explorer
                  </ExternalLink>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});
