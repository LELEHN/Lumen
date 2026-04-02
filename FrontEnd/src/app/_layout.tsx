import { Stack } from "expo-router"
import { CarrinhoProvider } from "../context/CarrinhoContext"

export default function Layout() {
  return (
    <CarrinhoProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CarrinhoProvider>
  )
}