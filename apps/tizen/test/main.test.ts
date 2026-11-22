import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Platform } from "pley-tv/platform";

const { startApp } = vi.hoisted(() => ({ startApp: vi.fn<(platform: Platform) => void>() }));
vi.mock("pley-tv", () => ({ startApp }));

beforeEach(() => {
  document.head.replaceChildren();
  vi.resetModules();
  startApp.mockClear();
});

describe("starting Samsung builds", () => {
  it("passes a platform without discovery to the app when the build marks it manual-address-only", async () => {
    document.head.insertAdjacentHTML("beforeend", '<meta name="pley-manual-address-only" content="true">');
    await import("../src/main");
    expect(startApp).toHaveBeenCalledTimes(1);
    const platform = startApp.mock.calls[0]![0];
    expect(platform.discover).toBeUndefined();
    expect(platform.localAddress).toBeUndefined();
  });

  it("passes the normal network address provider to the app without the build marker", async () => {
    await import("../src/main");
    expect(startApp).toHaveBeenCalledTimes(1);
    expect(startApp.mock.calls[0]![0].localAddress).toBeTypeOf("function");
  });
});
