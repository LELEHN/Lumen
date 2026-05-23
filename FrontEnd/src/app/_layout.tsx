import { Stack, useRouter, useSegments } from "expo-router"
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { CarrinhoProvider } from "../context/CarrinhoContext"
import { View, ActivityIndicator } from "react-native"

export default function Layout() {
  const router = useRouter()
  const segments = useSegments()
  const [checando, setChecando] = useState(true)

  useEffect(() => {
    async function verificarToken() {
      const token = await AsyncStorage.getItem("token")
      const naTelaPublica = segments[0] === "login" || segments[0] === "cadastro"

      if (!token && !naTelaPublica) {
        router.replace("/login" as any)
      }

      setChecando(false)
    }

    verificarToken()
  }, [segments])

  if (checando) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#FF40A3" />
      </View>
    )
  }

  return (
    <CarrinhoProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CarrinhoProvider>
  )
}