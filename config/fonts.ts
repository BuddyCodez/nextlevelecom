import { Fira_Code as FontMono, Inter as FontSans, Poppins  } from "next/font/google"

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
})
export const FontPoppins = Poppins({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  variable: "--font-poppins",
});