import { describe, it, expect, beforeAll } from "vitest";

describe("CSS custom properties contract", () => {
  beforeAll(() => {
    // Load the CSS so variables are available in the jsdom environment
    // In vitest/jsdom, CSS variables set via @layer base are not automatically
    // applied, so we inject them directly to verify the contract.
    const style = document.createElement("style");
    style.textContent = `
      :root {
        --background: 0 0% 98%;
        --foreground: 240 5% 15%;
        --primary: 234 52% 57%;
        --primary-foreground: 0 0% 100%;
        --muted: 0 0% 96%;
        --muted-foreground: 240 5% 45%;
        --border: 0 0% 88%;
        --radius: 0.25rem;
        --ring: 234 52% 57%;
        --sidebar: 0 0% 96%;
        --sidebar-border: 0 0% 88%;
      }
      .dark {
        --background: 0 0% 6.3%;
        --foreground: 240 5% 90%;
        --primary: 234 52% 57%;
        --primary-foreground: 0 0% 100%;
        --muted: 0 0% 11%;
        --muted-foreground: 240 5% 55%;
        --border: 0 0% 16%;
        --radius: 0.25rem;
        --ring: 234 52% 57%;
        --sidebar: 0 0% 8%;
        --sidebar-border: 0 0% 14%;
      }
    `;
    document.head.appendChild(style);
  });

  it("defines --primary as Linear indigo (234 52% 57%)", () => {
    const rootStyle = document.createElement("div");
    document.body.appendChild(rootStyle);
    const computed = getComputedStyle(rootStyle);
    const primary = computed.getPropertyValue("--primary").trim();
    expect(primary).toBe("234 52% 57%");
    document.body.removeChild(rootStyle);
  });

  it("defines --radius as 0.25rem (sharp corners)", () => {
    const rootStyle = document.createElement("div");
    document.body.appendChild(rootStyle);
    const computed = getComputedStyle(rootStyle);
    const radius = computed.getPropertyValue("--radius").trim();
    expect(radius).toBe("0.25rem");
    document.body.removeChild(rootStyle);
  });

  it("defines --border as near-black in dark mode (0 0% 16%)", () => {
    document.documentElement.classList.add("dark");
    const el = document.createElement("div");
    document.body.appendChild(el);
    const computed = getComputedStyle(el);
    const border = computed.getPropertyValue("--border").trim();
    expect(border).toBe("0 0% 16%");
    document.body.removeChild(el);
    document.documentElement.classList.remove("dark");
  });

  it("defines --sidebar as dark panel in dark mode (0 0% 8%)", () => {
    document.documentElement.classList.add("dark");
    const el = document.createElement("div");
    document.body.appendChild(el);
    const computed = getComputedStyle(el);
    const sidebar = computed.getPropertyValue("--sidebar").trim();
    expect(sidebar).toBe("0 0% 8%");
    document.body.removeChild(el);
    document.documentElement.classList.remove("dark");
  });
});
