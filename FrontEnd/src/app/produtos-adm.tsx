
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"

const produtos = [
  { id: 1, nome: "Body Splash Amoruda", marca: "O Boticário", preco: "R$ 90,00", image: require("../../assets/images/Body Splash Cuide-Se Bem Amoruda 200Ml O Boticário.avif") },
  { id: 2, nome: "Perfume Malbec", marca: "Malbec", preco: "R$ 250,90", image: require("../../assets/images/Perfume_Malbec_Gold_O_Boticario_100ml_4.webp") },
  { id: 3, nome: "Kit Eudora Siàge", marca: "Eudora", preco: "R$ 89,90", image: require("../../assets/images/Siàge Eudora Kit Completo Acelera o Crescimento 5 produtos.webp") },
  { id: 4, nome: "Desodorante Malbec", marca: "Malbec", preco: "R$ 40,00", image: require("../../assets/images/O Boticário Kit Desodorante Antitranspirante Malbec.webp") },
  { id: 5, nome: "Perfume Egeo Dolce", marca: "O Boticário", preco: "R$ 179,90", image: require("../../assets/images/Perfume Egeo Dolce Colônia, 90ml O Boticário.webp") },
  { id: 6, nome: "Sérum Vitamina C", marca: "O Boticário", preco: "R$ 99,90", image: require("../../assets/images/Sérum de Alta potência Vitamina C 10% Botik 15ml.webp") },
]

export default function ProdutosAdm() {
  const router = useRouter()

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
          <Text style={styles.sectionTitle}>Meus Produtos</Text>
          <TouchableOpacity>
            <LinearGradient
              colors={["#FF40A3", "#5BBCAA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addBtn}
            >
              <Text style={styles.addBtnText}>+</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produtos..."
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.grid}>
          {produtos.map((produto) => (
            <View key={produto.id} style={styles.card}>
              <Image source={produto.image} style={styles.cardImage} resizeMode="contain" />
              <Text style={styles.cardNome} numberOfLines={2}>{produto.nome}</Text>
              <Text style={styles.cardMarca}>{produto.marca}</Text>
              <Text style={styles.cardPreco}>{produto.preco}</Text>
              <TouchableOpacity>
                <LinearGradient
                  colors={["#FF40A3", "#5BBCAA"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.cardBtn}
                >
                  <Text style={styles.cardBtnText}>Comprar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ))}
        </View>

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
        <TouchableOpacity style={styles.navItem}>
          <Image source={require("../../assets/images/caixa-de-entrega.png")} style={styles.navIconImgActive} />
          <Text style={styles.navLabelActive}>Produtos</Text>
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
  addBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center" },
  addBtnText: { color: "#fff", fontSize: 22, fontWeight: "700", lineHeight: 24 },
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
  grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, gap: 12 },
  card: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardImage: { width: "100%", height: 120, marginBottom: 8, borderRadius: 8 },
  cardNome: { fontSize: 12, fontWeight: "600", color: "#333", minHeight: 32 },
  cardMarca: { fontSize: 11, color: "#999", marginTop: 2 },
  cardPreco: { fontSize: 14, fontWeight: "700", color: "#FF40A3", marginTop: 4, marginBottom: 2 },
  cardBtn: { borderRadius: 20, paddingVertical: 8, alignItems: "center", marginTop: 8 },
  cardBtnText: { color: "#fff", fontWeight: "700", fontSize: 12 },
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