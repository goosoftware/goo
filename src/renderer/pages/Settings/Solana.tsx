import { RadioGroup } from "@headlessui/react";
import ExternalLink from "components/ExternalLink";
import { observer } from "mobx-react-lite";
import { store } from "models/Store";
import React from "react";

const Solana = () => {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h4 className="text-lg font-semibold text-gray-300">
          {store.solanaCliVersion}
        </h4>

        <h1 className="py-4 text-2xl font-semibold text-gray-900">Solana</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h3 className="text-lg leading-6 font-medium dark:text-gray-200">
          Which cluster do you want to connect to?
        </h3>
        <p className="mt-1 max-w-2xl text-sm dark:text-gray-400">
          Solana maintains several different clusters with different purposes.
          <ExternalLink
            href="https://docs.solana.com/clusters"
            className="px-3"
          >
            More info
          </ExternalLink>
        </p>
        <ClusterSelect />
      </div>
    </div>
  );
};

const settings = [
  {
    id: "main",
    name: "mainnet-beta",
    description:
      "The main, live cluster for Solana. Tokens issued on Mainnet Beta are real $SOL and SPL projects.",
  },
  {
    id: "dev",
    name: "devnet",
    description:
      "A playground for anyone who wants to take Solana for a test drive, as a user, token holder, app developer, or validator.",
  },
  {
    id: "test",
    name: "testnet",
    description:
      "Used to stress test recent release features on a live cluster, particularly focused on network performance, stability and validator behavior",
  },
  {
    id: "local",
    name: "localnet",
    description:
      "Run a test Solana cluster locally on your machine. A great choice for rapid, iterative development and testing.",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ClusterSelect = observer(() => (
  <RadioGroup value={store.cluster} onChange={store.changeCluster}>
    <RadioGroup.Label className="sr-only">Privacy setting</RadioGroup.Label>
    <div className="bg-white rounded-md -space-y-px py-4">
      {settings.map((setting, settingIdx) => (
        <RadioGroup.Option
          key={setting.id}
          value={setting.id}
          className={({ checked }) =>
            classNames(
              settingIdx === 0 ? "rounded-tl-md rounded-tr-md" : "",
              settingIdx === settings.length - 1
                ? "rounded-bl-md rounded-br-md"
                : "",
              checked
                ? "dark:bg-solanaGreen dark:border-gray-900 z-10"
                : "border-gray-200 hover:bg-gray-200",
              "relative border p-4 flex cursor-pointer focus:outline-none dark:bg-gray-800"
            )
          }
        >
          {({ active, checked }) => (
            <>
              <span
                className={classNames(
                  checked
                    ? "bg-indigo-600 border-transparent"
                    : "bg-white border-gray-300",
                  active ? "ring-2 ring-offset-2 ring-indigo-500" : "",
                  "h-4 w-4 mt-0.5 cursor-pointer rounded-full border flex items-center justify-center"
                )}
                aria-hidden="true"
              >
                <span className="rounded-full bg-white w-1.5 h-1.5" />
              </span>
              <div className="ml-3 flex flex-col">
                <RadioGroup.Label
                  as="span"
                  className={classNames(
                    checked ? "text-indigo-900" : "text-gray-900",
                    "block text-sm font-medium"
                  )}
                >
                  {setting.name}
                </RadioGroup.Label>
                <RadioGroup.Description
                  as="span"
                  className={classNames(
                    checked ? "text-indigo-700" : "text-gray-500",
                    "block text-sm"
                  )}
                >
                  {setting.description}
                </RadioGroup.Description>
              </div>
            </>
          )}
        </RadioGroup.Option>
      ))}
    </div>
  </RadioGroup>
));

export default observer(Solana);
