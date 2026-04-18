import { useEffect, useState } from "react"
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"

const API_URL = "http://192.168.0.183:5010"

type Venda = {
  id: number
  cliente_nome: string
  valor_total: string
  status: string
  data_venda: string
}

const filtros = ["Todos", "Pago", "Pendente", "Em andamento"]

export default function Pagamentos() {
  const router = useRouter()
  const [filtroAtivo, setFiltroAtivo] = useState("Todos")
  const [vendas, setVendas] = useState<Venda[]>([])
  const [busca, setBusca] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarVendas()
  }, [])

  async function carregarVendas() {
    try {
      const token = await AsyncStorage.getItem("token")
      const resp = await fetch(`${API_URL}/adm/vendas`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.erro)
      setVendas(data.vendas)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function alterarStatus(id: number, novoStatus: string) {
    try {
      const token = await AsyncStorage.getItem("token")
      await fetch(`${API_URL}/adm/venda/${id}/status`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: novoStatus })
      })
      // Atualiza localmente
      setVendas(prev => prev.map(v => v.id === id ? { ...v, status: novoStatus.toLowerCase() } : v))
    } catch (err) {
      console.error(err)
    }
  }

  function formatarData(dataStr: string) {
    const d = new Date(dataStr)
    return d.toLocaleDateString("pt-BR")
  }

  const vendasFiltradas = vendas.filter(v => {
    const statusOk = filtroAtivo === "Todos" || v.status?.toLowerCase() === filtroAtivo.toLowerCase()
    const buscaOk = busca.trim() === "" || v.cliente_nome.toLowerCase().includes(busca.toLowerCase())
    return statusOk && buscaOk
  })

  const totalPago = vendas.filter(v => v.status?.toLowerCase() === "pago")
    .reduce((acc, v) => acc + parseFloat(v.valor_total), 0)
  const totalPendente = vendas.filter(v => v.status?.toLowerCase() === "pendente")
    .reduce((acc, v) => acc + parseFloat(v.valor_total), 0)
  const totalAndamento = vendas.filter(v => v.status?.toLowerCase() === "em andamento")
    .reduce((acc, v) => acc + parseFloat(v.valor_total), 0)

  function getStatusColor(status: string) {
    const s = status?.toLowerCase()
    if (s === "pago") return "#5BBCAA"
    if (s === "pendente") return "#FFA500"
    return "#2196F3"
  }

  function getStatusBg(status: string) {
    const s = status?.toLowerCase()
    if (s === "pago") return "#E8F8F5"
    if (s === "pendente") return "#FFF3E0"
    return "#E3F2FD"
  }

  function getStatusLabel(status: string) {
    const s = status?.toLowerCase()
    if (s === "pago") return "Pago"
    if (s === "pendente") return "Pendente"
    return "Em andamento"
  }

  function proximoStatus(status: string) {
    const s = status?.toLowerCase()
    if (s === "pendente") return "EM_ANDAMENTO"
    if (s === "em andamento") return "PAGO"
    return null
  }

  function labelProximoStatus(status: string) {
    const s = status?.toLowerCase()
    if (s === "pendente") return "→ Em andamento"
    if (s === "em andamento") return "→ Marcar pago"
    return null
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
          <Text style={styles.sectionTitle}>Pagamentos</Text>
        </View>

        {/* RESUMO */}
        <View style={styles.resumoRow}>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoEmoji}>✅</Text>
            <Text style={styles.resumoLabel}>Recebidos</Text>
            <Text style={[styles.resumoValor, { color: "#5BBCAA" }]}>
              R$ {totalPago.toFixed(2).replace(".", ",")}
            </Text>
          </View>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoEmoji}>⏳</Text>
            <Text style={styles.resumoLabel}>Pendentes</Text>
            <Text style={[styles.resumoValor, { color: "#FFA500" }]}>
              R$ {totalPendente.toFixed(2).replace(".", ",")}
            </Text>
          </View>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoEmoji}>🔄</Text>
            <Text style={styles.resumoLabel}>Em andamento</Text>
            <Text style={[styles.resumoValor, { color: "#2196F3" }]}>
              R$ {totalAndamento.toFixed(2).replace(".", ",")}
            </Text>
          </View>
        </View>

        {/* BUSCA */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por cliente..."
            placeholderTextColor="#aaa"
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        {/* FILTROS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtrosScroll}>
          {filtros.map((filtro) => (
            filtro === filtroAtivo ? (
              <TouchableOpacity key={filtro} onPress={() => setFiltroAtivo(filtro)}>
                <LinearGradient
                  colors={["#FF40A3", "#5BBCAA"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.filtroAtivo}
                >
                  <Text style={styles.filtroAtivoText}>{filtro}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity key={filtro} style={styles.filtroBtn} onPress={() => setFiltroAtivo(filtro)}>
                <Text style={styles.filtroBtnText}>{filtro}</Text>
              </TouchableOpacity>
            )
          ))}
        </ScrollView>

        {loading && <ActivityIndicator color="#FF40A3" style={{ marginTop: 24 }} />}

        {!loading && vendasFiltradas.length === 0 && (
          <Text style={styles.vazioText}>Nenhuma venda encontrada.</Text>
        )}

        {/* LISTA */}
        {vendasFiltradas.map((venda) => (
          <View key={venda.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.cardNome}>{venda.cliente_nome}</Text>
                <Text style={styles.cardMetodo}>Pedido #{venda.id}</Text>
              </View>
              <View style={styles.cardRight}>
                <Text style={styles.cardValor}>
                  R$ {parseFloat(venda.valor_total).toFixed(2).replace(".", ",")}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusBg(venda.status) }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(venda.status) }]}>
                    {getStatusLabel(venda.status)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.cardBottom}>
              <Text style={styles.cardData}>📅 {formatarData(venda.data_venda)}</Text>

              {/* Botão para avançar status */}
              {proximoStatus(venda.status) && (
                <TouchableOpacity
                  style={styles.avancarBtn}
                  onPress={() => alterarStatus(venda.id, proximoStatus(venda.status)!)}
                >
                  <Text style={styles.avancarBtnText}>
                    {labelProximoStatus(venda.status)}
                  </Text>
                </TouchableOpacity>
              )}
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
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/clientes" as any)}>
          <Image source={require("../../assets/images/cliente.png")} style={styles.navIconImg} />
          <Text style={styles.navLabel}>Clientes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/produtos-adm" as any)}>
          <Image source={require("../../assets/images/caixa-de-entrega.png")} style={styles.navIconImg} />
          <Text style={styles.navLabel}>Produtos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image source={require("../../assets/images/cartao-do-banco.png")} style={styles.navIconImgActive} />
          <Text style={styles.navLabelActive}>Pagamentos</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF0F5" },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16,
  },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  headerIcon: { color: "#fff", fontSize: 20, fontWeight: "700" },
  scroll: { flex: 1 },
  sectionHeader: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#FF40A3" },
  resumoRow: { flexDirection: "row", paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  resumoCard: {
    flex: 1, backgroundColor: "#fff", borderRadius: 12,
    padding: 10, alignItems: "center", elevation: 2,
  },
  resumoEmoji: { fontSize: 18, marginBottom: 4 },
  resumoLabel: { fontSize: 10, color: "#999", marginBottom: 4, textAlign: "center" },
  resumoValor: { fontSize: 11, fontWeight: "700", textAlign: "center" },
  searchContainer: { paddingHorizontal: 16, marginBottom: 12 },
  searchInput: {
    backgroundColor: "#fff", borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 14, color: "#333", elevation: 2,
  },
  filtrosScroll: { paddingLeft: 16, marginBottom: 16 },
  filtroAtivo: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8 },
  filtroAtivoText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  filtroBtn: { backgroundColor: "#fff", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8 },
  filtroBtnText: { color: "#999", fontSize: 13, fontWeight: "600" },
  vazioText: { color: "#999", textAlign: "center", marginTop: 24 },
  card: {
    backgroundColor: "#fff", borderRadius: 16,
    marginHorizontal: 16, marginBottom: 10, padding: 16, elevation: 3,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  cardNome: { fontSize: 14, fontWeight: "700", color: "#333" },
  cardMetodo: { fontSize: 12, color: "#999", marginTop: 2 },
  cardRight: { alignItems: "flex-end", gap: 6 },
  cardValor: { fontSize: 14, fontWeight: "700", color: "#333" },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: "700" },
  cardBottom: {
    borderTopWidth: 1, borderTopColor: "#f0f0f0", paddingTop: 8,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between"
  },
  cardData: { fontSize: 12, color: "#999" },
  avancarBtn: {
    backgroundColor: "#FFF0F5", borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: "#FF40A3"
  },
  avancarBtnText: { color: "#FF40A3", fontSize: 11, fontWeight: "700" },
  bottomNav: {
    flexDirection: "row", backgroundColor: "#fff",
    paddingVertical: 10, paddingBottom: 24,
    borderTopWidth: 1, borderTopColor: "#f0f0f0",
  },
  navItem: { flex: 1, alignItems: "center", gap: 4 },
  navIconImg: { width: 22, height: 22, tintColor: "#999" },
  navIconImgActive: { width: 22, height: 22, tintColor: "#FF40A3" },
  navLabel: { fontSize: 11, color: "#999" },
  navLabelActive: { fontSize: 11, color: "#FF40A3", fontWeight: "700" },
})