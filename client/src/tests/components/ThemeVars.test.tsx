import { describe, it, expect, beforeAll } from "vitest";

describe("CSS custom properties contract — Supabase palette", () => {
  beforeAll(() => {
    const style = document.createElement("style");
    style.textContent = `
      :root {
        --background: 0 0% 100%;
        --foreground: 0 0% 9%;
        --primary: 153 57% 36%;
        --primary-foreground: 0 0% 100%;
        --muted: 0 0% 96%;
        --muted-foreground: 0 0% 40%;
        --border: 0 0% 87%;
        --radius: 0.375rem;
        --ring: 153 57% 36%;
        --sidebar: 0 0% 97%;
        --sidebar-border: 0 0% 87%;
      }
      .dark {
        --background: 0 0% 11%;
        --foreground: 0 0% 93%;
        --primary: 153 60% 53%;
        --primary-foreground: 0 0% 7%;
        --muted: 0 0% 16%;
        --muted-foreground: 0 0% 60%;
        --border: 0 0% 20%;
        --radius: 0.375rem;
        --ring: 153 60% 53%;
        --sidebar: 0 0% 8%;
        --sidebar-border: 0 0% 17%;
      }
    `;
    document.head.appendChild(style);
  });

  it("light --primary is Supabase brand green (153 57% 36%)", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    expect(getComputedStyle(el).getPropertyValue("--primary").trim()).toBe("153 57% 36%");
    document.body.removeChild(el);
  });

  it("--radius is 0.375rem (6px)", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    expect(getComputedStyle(el).getPropertyValue("--radius").trim()).toBe("0.375rem");
    document.body.removeChild(el);
  });

  it("dark --background is Supabase canvas.default (0 0% 11%)", () => {
    document.documentElement.classList.add("dark");
    const el = document.createElement("div");
    document.body.appendChild(el);
    expect(getComputedStyle(el).getPropertyValue("--background").trim()).toBe("0 0% 11%");
    document.body.removeChild(el);
    document.documentElement.classList.remove("dark");
  });

  it("dark --primary is Supabase brand green accent.fg (153 60% 53%)", () => {
    document.documentElement.classList.add("dark");
    const el = document.createElement("div");
    document.body.appendChild(el);
    expect(getComputedStyle(el).getPropertyValue("--primary").trim()).toBe("153 60% 53%");
    document.body.removeChild(el);
    document.documentElement.classList.remove("dark");
  });

  it("dark --sidebar is distinctly darker than canvas (0 0% 8%)", () => {
    document.documentElement.classList.add("dark");
    const el = document.createElement("div");
    document.body.appendChild(el);
    expect(getComputedStyle(el).getPropertyValue("--sidebar").trim()).toBe("0 0% 8%");
    document.body.removeChild(el);
    document.documentElement.classList.remove("dark");
  });

  it("dark --border is Supabase border.default (0 0% 20%)", () => {
    document.documentElement.classList.add("dark");
    const el = document.createElement("div");
    document.body.appendChild(el);
    expect(getComputedStyle(el).getPropertyValue("--border").trim()).toBe("0 0% 20%");
    document.body.removeChild(el);
    document.documentElement.classList.remove("dark");
  });
});
