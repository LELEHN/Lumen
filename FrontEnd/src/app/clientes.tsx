import { useEffect, useState } from "react"
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, ActivityIndicator
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"

const API_URL = "http://192.168.0.183:5010"

type Cliente = {
  id: number
  nome: string
  email: string
  total_pedidos: number
  total_gasto: string
}

export default function Clientes() {
  const router = useRouter()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filtrados, setFiltrados] = useState<Cliente[]>([])
  const [busca, setBusca] = useState("")
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    carregarClientes()
  }, [])

  useEffect(() => {
    if (busca.trim() === "") {
      setFiltrados(clientes)
    } else {
      const termo = busca.toLowerCase()
      setFiltrados(
        clientes.filter(c =>
          c.nome.toLowerCase().includes(termo) ||
          c.email.toLowerCase().includes(termo)
        )
      )
    }
  }, [busca, clientes])

  async function carregarClientes() {
    try {
      const token = await AsyncStorage.getItem("token")

      const resp = await fetch(`${API_URL}/adm/clientes`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      const data = await resp.json()

      if (!resp.ok) throw new Error(data.erro || "Erro ao buscar clientes")

      setClientes(data.clientes)
      setFiltrados(data.clientes)
    } catch (err: any) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>

      <LinearGradient
        colors={["#FF40A3", "#5BBCAA"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Minha Revendedora</Text>
        <TouchableOpacity onPress={() => router.push("/login" as any)}>
          <Text style={styles.headerIcon}>→</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Meus Clientes</Text>
          {/* total dinâmico */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{clientes.length}</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome ou e-mail..."
            placeholderTextColor="#aaa"
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        {loading && <ActivityIndicator color="#FF40A3" style={{ marginTop: 24 }} />}

        {erro !== "" && (
          <Text style={styles.erroText}>{erro}</Text>
        )}

        {!loading && filtrados.length === 0 && (
          <Text style={styles.vazioText}>Nenhum cliente encontrado.</Text>
        )}

        {filtrados.map((cliente) => (
          <View key={cliente.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardNome}>{cliente.nome}</Text>
                <Text style={styles.cardTotal}>
                  Total gasto: R$ {parseFloat(cliente.total_gasto).toFixed(2)}
                </Text>
              </View>
              {/* badge de pedidos */}
              <View style={styles.pedidosBadge}>
                <Text style={styles.pedidosBadgeText}>
                  {cliente.total_pedidos} {cliente.total_pedidos === 1 ? "pedido" : "pedidos"}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardInfo}>
              <Image
                source={require("../../assets/images/o-email.png")}
                style={styles.infoIcon}
              />
              <Text style={styles.cardInfoText}>{cliente.email}</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/dashboard" as any)}>
          <Image source={require("../../assets/images/silhueta-de-icone-de-casa.png")} style={styles.navIconImg} />
          <Text style={styles.navLabel}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image source={require("../../assets/images/cliente.png")} style={styles.navIconImgActive} />
          <Text style={styles.navLabelActive}>Clientes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/produtos-adm" as any)}>
          <Image source={require("../../assets/images/caixa-de-entrega.png")} style={styles.navIconImg} />
          <Text style={styles.navLabel}>Produtos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/pagamentos" as any)}>
          <Image source={require("../../assets/images/cartao-do-banco.png")} style={styles.navIconImg} />
          <Text style={styles.navLabel}>Pagamentos</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF0F5" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 16,
  },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  headerIcon: { color: "#fff", fontSize: 20, fontWeight: "700" },
  scroll: { flex: 1 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#FF40A3" },
  badge: {
    backgroundColor: "#FF40A3",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  searchContainer: { paddingHorizontal: 16, marginBottom: 12 },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
    elevation: 2,
  },
  erroText: { color: "red", textAlign: "center", marginTop: 16 },
  vazioText: { color: "#999", textAlign: "center", marginTop: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  cardNome: { fontSize: 16, fontWeight: "700", color: "#333" },
  cardTotal: { fontSize: 13, color: "#5BBCAA", fontWeight: "600", marginTop: 2 },
  pedidosBadge: {
    backgroundColor: "#FFF0F5",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#FF40A3",
  },
  pedidosBadgeText: { color: "#FF40A3", fontSize: 11, fontWeight: "700" },
  divider: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 12 },
  cardInfo: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  infoIcon: { width: 14, height: 14, tintColor: "#999" },
  cardInfoText: { fontSize: 13, color: "#666" },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  navItem: { flex: 1, alignItems: "center", gap: 4 },
  navIconImg: { width: 22, height: 22, tintColor: "#999" },
  navIconImgActive: { width: 22, height: 22, tintColor: "#FF40A3" },
  navLabel: { fontSize: 11, color: "#999" },
  navLabelActive: { fontSize: 11, color: "#FF40A3", fontWeight: "700" },
})