import { useRef, useState } from "react";
import { NetworkOptions } from "./NetworkOptions";
import { ArrowsRightLeftIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { BaseIcon } from "~~/components/assets/BaseIcon";
import { EthIcon } from "~~/components/assets/EthIcon";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { getTargetNetworks } from "~~/utils/scaffold-eth";

const allowedNetworks = getTargetNetworks();

type SwitchNetworkDropdownProps = {
  chainName: any;
  btn: any;
};

export const SwitchNetworkDropdown = ({ chainName, btn }: SwitchNetworkDropdownProps) => {
  const [selectingNetwork, setSelectingNetwork] = useState(false);
  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const closeDropdown = () => {
    setSelectingNetwork(false);
    dropdownRef.current?.removeAttribute("open");
  };
  useOutsideClick(dropdownRef, closeDropdown);

  return (
    <>
      <details ref={dropdownRef} className={`dropdown dropdown-end leading-3 ${btn == "small" ? "" : "w-full"}`}>
        <summary
          tabIndex={0}
          className={`btn btn-neutral ${
            btn == "small" ? "btn-sm px-2" : "flex justify-between px-4"
          } dropdown-toggle gap-0 !h-auto`}
        >
          {(chainName == "Base" || chainName == "Base Sepolia") && <BaseIcon width={18} height={18} fill="#3C3C3C" />}
          {(chainName == "Ethereum" || chainName == "Sepolia") && <EthIcon width={18} height={18} fill="#3C3C3C" />}
          <div className="ml-1">{chainName}</div>
          <ChevronDownIcon className="h-6 w-4 ml-1" />
        </summary>
        <ul
          tabIndex={0}
          className="dropdown-content menu z-[2] p-2 mt-2 shadow-center shadow-accent bg-base-200 rounded-box gap-1"
        >
          <NetworkOptions hidden={!selectingNetwork} />
          {allowedNetworks.length > 1 ? (
            <li className={selectingNetwork ? "hidden" : ""}>
              <button
                className="btn-sm !rounded-xl flex gap-3 py-3"
                type="button"
                onClick={() => {
                  setSelectingNetwork(true);
                }}
              >
                <ArrowsRightLeftIcon className="h-6 w-4 ml-2 sm:ml-0" /> <span>Switch Network</span>
              </button>
            </li>
          ) : null}
        </ul>
      </details>
    </>
  );
};
