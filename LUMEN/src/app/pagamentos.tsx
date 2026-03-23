
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useState } from "react"

const pagamentos = [
  { id: 1, nome: "Júlia Mara", metodo: "PIX", valor: "R$ 92,90", data: "01/03/2026", status: "pago" },
  { id: 2, nome: "Lethicia Nobre", metodo: "Cartão", valor: "R$ 90,00", data: "01/03/2026", status: "pago" },
  { id: 3, nome: "Luiza Cristina", metodo: "Dinheiro", valor: "R$ 105,00", data: "01/03/2026", status: "pendente" },
  { id: 4, nome: "Pedro Augusto", metodo: "Boleto", valor: "R$ 39,90", data: "01/03/2026", status: "atrasado" },
  { id: 5, nome: "Allan Lopes", metodo: "Boleto", valor: "R$ 310,00", data: "01/03/2026", status: "atrasado" },
]

const filtros = ["Todos", "Pagos", "Pendentes", "Atrasados"]

export default function Pagamentos() {
  const router = useRouter()
  const [filtroAtivo, setFiltroAtivo] = useState("Todos")

  const pagamentosFiltrados = pagamentos.filter((p) => {
    if (filtroAtivo === "Todos") return true
    if (filtroAtivo === "Pagos") return p.status === "pago"
    if (filtroAtivo === "Pendentes") return p.status === "pendente"
    if (filtroAtivo === "Atrasados") return p.status === "atrasado"
    return true
  })

  const totalRecebido = pagamentos.filter((p) => p.status === "pago").reduce((acc, p) => acc + parseFloat(p.valor.replace("R$ ", "").replace(",", ".")), 0)
  const totalPendente = pagamentos.filter((p) => p.status === "pendente").reduce((acc, p) => acc + parseFloat(p.valor.replace("R$ ", "").replace(",", ".")), 0)
  const totalAtrasado = pagamentos.filter((p) => p.status === "atrasado").reduce((acc, p) => acc + parseFloat(p.valor.replace("R$ ", "").replace(",", ".")), 0)

  const getStatusStyle = (status: string) => {
    if (status === "pago") return styles.statusPago
    if (status === "pendente") return styles.statusPendente
    return styles.statusAtrasado
  }

  const getStatusIcon = (status: string) => {
    if (status === "pago") return require("../../assets/images/verificar.png")
    if (status === "pendente") return require("../../assets/images/ampulheta.png")
    return require("../../assets/images/cruz.png")
  }

  const getStatusColor = (status: string) => {
    if (status === "pago") return "#5BBCAA"
    if (status === "pendente") return "#FFA500"
    return "#FF4444"
  }

  const getStatusLabel = (status: string) => {
    if (status === "pago") return "Pago"
    if (status === "pendente") return "Pendente"
    return "Atrasado"
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
            <Image source={require("../../assets/images/verificar.png")} style={[styles.resumoIcon, { tintColor: "#5BBCAA" }]} />
            <Text style={styles.resumoLabel}>Recebidos</Text>
            <Text style={[styles.resumoValor, { color: "#5BBCAA" }]}>R$ {totalRecebido.toFixed(2).replace(".", ",")}</Text>
          </View>
          <View style={styles.resumoCard}>
            <Image source={require("../../assets/images/ampulheta.png")} style={[styles.resumoIcon, { tintColor: "#FFA500" }]} />
            <Text style={styles.resumoLabel}>Pendentes</Text>
            <Text style={[styles.resumoValor, { color: "#FFA500" }]}>R$ {totalPendente.toFixed(2).replace(".", ",")}</Text>
          </View>
          <View style={styles.resumoCard}>
            <Image source={require("../../assets/images/cruz.png")} style={[styles.resumoIcon, { tintColor: "#FF4444" }]} />
            <Text style={styles.resumoLabel}>Atrasados</Text>
            <Text style={[styles.resumoValor, { color: "#FF4444" }]}>R$ {totalAtrasado.toFixed(2).replace(".", ",")}</Text>
          </View>
        </View>

        {/* BUSCA */}
        <View style={styles.searchContainer}>
          <TextInput style={styles.searchInput} placeholder="Buscar..." placeholderTextColor="#aaa" />
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

        {/* LISTA */}
        {pagamentosFiltrados.map((pagamento) => (
          <View key={pagamento.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.cardNome}>{pagamento.nome}</Text>
                <Text style={styles.cardMetodo}>{pagamento.metodo}</Text>
              </View>
              <View style={styles.cardRight}>
                <Text style={styles.cardValor}>{pagamento.valor}</Text>
                <View style={[getStatusStyle(pagamento.status), styles.statusBadge]}>
                  <Image
                    source={getStatusIcon(pagamento.status)}
                    style={[styles.statusIconImg, { tintColor: getStatusColor(pagamento.status) }]}
                  />
                  <Text style={[styles.statusText, { color: getStatusColor(pagamento.status) }]}>
                    {getStatusLabel(pagamento.status)}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.cardBottom}>
              <Image source={require("../../assets/images/calendario.png")} style={styles.dataIcon} />
              <Text style={styles.cardData}>{pagamento.data}</Text>
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
  sectionHeader: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#FF40A3" },
  resumoRow: { flexDirection: "row", paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  resumoCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    elevation: 2,
  },
  resumoIcon: { width: 20, height: 20, marginBottom: 4 },
  resumoLabel: { fontSize: 10, color: "#999", marginBottom: 4 },
  resumoValor: { fontSize: 12, fontWeight: "700" },
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
  filtrosScroll: { paddingLeft: 16, marginBottom: 16 },
  filtroAtivo: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8 },
  filtroAtivoText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  filtroBtn: { backgroundColor: "#fff", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8 },
  filtroBtnText: { color: "#999", fontSize: 13, fontWeight: "600" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 16,
    elevation: 3,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  cardNome: { fontSize: 14, fontWeight: "700", color: "#333" },
  cardMetodo: { fontSize: 12, color: "#999", marginTop: 2 },
  cardRight: { alignItems: "flex-end", gap: 6 },
  cardValor: { fontSize: 14, fontWeight: "700", color: "#333" },
  statusBadge: { flexDirection: "row", alignItems: "center", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, gap: 4 },
  statusPago: { backgroundColor: "#E8F8F5" },
  statusPendente: { backgroundColor: "#FFF3E0" },
  statusAtrasado: { backgroundColor: "#FFEBEE" },
  statusIconImg: { width: 12, height: 12 },
  statusText: { fontSize: 11, fontWeight: "700" },
  cardBottom: { borderTopWidth: 1, borderTopColor: "#f0f0f0", paddingTop: 8, flexDirection: "row", alignItems: "center", gap: 6 },
  dataIcon: { width: 12, height: 12, tintColor: "#999" },
  cardData: { fontSize: 12, color: "#999" },
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