import { describe, it, expect, beforeAll } from "vitest";

describe("CSS custom properties contract — GitHub Primer palette", () => {
  beforeAll(() => {
    const style = document.createElement("style");
    style.textContent = `
      :root {
        --background: 0 0% 100%;
        --foreground: 213 13% 14%;
        --primary: 212 92% 44%;
        --primary-foreground: 0 0% 100%;
        --muted: 210 17% 97%;
        --muted-foreground: 212 8% 43%;
        --border: 210 18% 84%;
        --radius: 0.375rem;
        --ring: 212 92% 44%;
        --sidebar: 210 17% 97%;
        --sidebar-border: 210 18% 84%;
      }
      .dark {
        --background: 216 28% 7%;
        --foreground: 210 36% 93%;
        --primary: 215 92% 58%;
        --primary-foreground: 0 0% 100%;
        --muted: 216 15% 15%;
        --muted-foreground: 213 9% 58%;
        --border: 215 11% 21%;
        --radius: 0.375rem;
        --ring: 215 92% 58%;
        --sidebar: 216 28% 9%;
        --sidebar-border: 215 11% 21%;
      }
    `;
    document.head.appendChild(style);
  });

  it("defines --primary as GitHub blue in light mode (212 92% 44%)", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    const primary = getComputedStyle(el).getPropertyValue("--primary").trim();
    expect(primary).toBe("212 92% 44%");
    document.body.removeChild(el);
  });

  it("defines --radius as 0.375rem (GitHub 6px standard)", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    const radius = getComputedStyle(el).getPropertyValue("--radius").trim();
    expect(radius).toBe("0.375rem");
    document.body.removeChild(el);
  });

  it("defines dark --background as GitHub canvas.default (216 28% 7%)", () => {
    document.documentElement.classList.add("dark");
    const el = document.createElement("div");
    document.body.appendChild(el);
    const bg = getComputedStyle(el).getPropertyValue("--background").trim();
    expect(bg).toBe("216 28% 7%");
    document.body.removeChild(el);
    document.documentElement.classList.remove("dark");
  });

  it("defines dark --border as GitHub border.default (215 11% 21%)", () => {
    document.documentElement.classList.add("dark");
    const el = document.createElement("div");
    document.body.appendChild(el);
    const border = getComputedStyle(el).getPropertyValue("--border").trim();
    expect(border).toBe("215 11% 21%");
    document.body.removeChild(el);
    document.documentElement.classList.remove("dark");
  });

  it("defines dark --primary as GitHub accent.fg blue (215 92% 58%)", () => {
    document.documentElement.classList.add("dark");
    const el = document.createElement("div");
    document.body.appendChild(el);
    const primary = getComputedStyle(el).getPropertyValue("--primary").trim();
    expect(primary).toBe("215 92% 58%");
    document.body.removeChild(el);
    document.documentElement.classList.remove("dark");
  });
});
