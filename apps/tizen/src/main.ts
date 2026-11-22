import { startApp } from "pley-tv";
import { tizenPlatform } from "./platform";

const manualAddressOnly = document.querySelector('meta[name="pley-manual-address-only"]') !== null;
startApp(tizenPlatform(manualAddressOnly));
