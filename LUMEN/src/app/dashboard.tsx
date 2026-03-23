
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"

const vendasRecentes = [
  { id: 1, nome: "Júlia Mara", produto: "Body Splash Amoruda", valor: "R$ 92,90", tempo: "há 2h" },
  { id: 2, nome: "Allan Lopes", produto: "Perfume Malbec", valor: "R$ 159,99", tempo: "há 18h" },
  { id: 3, nome: "Lethicia Nobre", produto: "Kit Eudora Siàge Resgate Imediato", valor: "R$ 340,94", tempo: "há 3d" },
  { id: 4, nome: "Pedro Augusto", produto: "Desodorante Aerosol Malbec", valor: "R$ 39,90", tempo: "há 3d" },
  { id: 5, nome: "Luiza Cristina", produto: "Egeo Dolce", valor: "R$ 105,46", tempo: "há 9h" },
]

export default function Dashboard() {
  const router = useRouter()

  return (
    <View style={styles.container}>

      {/* HEADER */}
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

        {/* BANNER */}
        <LinearGradient
          colors={["#FF40A3", "#5BBCAA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.banner}
        >
          <Text style={styles.bannerTitle}>Olá, Revendedora! 👋</Text>
          <Text style={styles.bannerSub}>Aqui está um resumo do seu negócio hoje</Text>
        </LinearGradient>

        {/* CARDS */}
        <View style={styles.cardsRow}>
          <TouchableOpacity style={styles.card} onPress={() => router.push("/clientes" as any)}>
            <View style={styles.cardIconBox}>
              <LinearGradient
                colors={["#FF40A3", "#5BBCAA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cardIconGradient}
              >
                <Image source={require("../../assets/images/cliente.png")} style={styles.cardIconImg} />
              </LinearGradient>
            </View>
            <Text style={styles.cardNum}>48</Text>
            <Text style={styles.cardLabel}>Clientes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => router.push("/produtos-adm" as any)}>
            <View style={styles.cardIconBox}>
              <LinearGradient
                colors={["#5BBCAA", "#FF40A3"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cardIconGradient}
              >
                <Image source={require("../../assets/images/caixa-de-entrega.png")} style={styles.cardIconImg} />
              </LinearGradient>
            </View>
            <Text style={styles.cardNum}>146</Text>
            <Text style={styles.cardLabel}>Produtos</Text>
          </TouchableOpacity>
        </View>

        {/* VENDAS RECENTES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vendas Recentes</Text>
          {vendasRecentes.map((venda) => (
            <View key={venda.id} style={styles.vendaItem}>
              <View style={styles.vendaLeft}>
                <Text style={styles.vendaNome}>{venda.nome}</Text>
                <Text style={styles.vendaProduto}>{venda.produto}</Text>
              </View>
              <View style={styles.vendaRight}>
                <Text style={styles.vendaValor}>{venda.valor}</Text>
                <Text style={styles.vendaTempo}>{venda.tempo}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Image source={require("../../assets/images/silhueta-de-icone-de-casa.png")} style={styles.navIconImgActive} />
          <Text style={styles.navLabelActive}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/clientes" as any)}>
          <Image source={require("../../assets/images/cliente.png")} style={styles.navIconImg} />
          <Text style={styles.navLabel}>Clientes</Text>
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
  banner: { margin: 16, borderRadius: 16, padding: 20 },
  bannerTitle: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 4 },
  bannerSub: { color: "#fff", fontSize: 13, opacity: 0.9 },
  cardsRow: { flexDirection: "row", paddingHorizontal: 16, gap: 12, marginBottom: 20 },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardIconBox: { marginBottom: 12 },
  cardIconGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  cardIconImg: { width: 22, height: 22, tintColor: "#fff" },
  cardNum: { fontSize: 28, fontWeight: "800", color: "#333" },
  cardLabel: { fontSize: 14, color: "#999", marginTop: 2 },
  section: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#FF40A3", marginBottom: 16 },
  vendaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  vendaLeft: { flex: 1 },
  vendaNome: { fontSize: 13, fontWeight: "700", color: "#333" },
  vendaProduto: { fontSize: 12, color: "#999", marginTop: 2 },
  vendaRight: { alignItems: "flex-end" },
  vendaValor: { fontSize: 13, fontWeight: "700", color: "#333" },
  vendaTempo: { fontSize: 11, color: "#999", marginTop: 2 },
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