// src/app/clientes.tsx

import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"

const clientes = [
  { id: 1, nome: "Júlia Mara", total: "R$ 92,90", telefone: "(11) 92146-2646", email: "julia@gmail.com" },
  { id: 2, nome: "Allan Lopes", total: "R$ 380,00", telefone: "(11) 99259-5045", email: "lopes@gmail.com" },
  { id: 3, nome: "Lethicia Nobre", total: "R$ 90,00", telefone: "(11) 95838-9257", email: "leleh@gmail.com" },
  { id: 4, nome: "Pedro Augusto", total: "R$ 105,00", telefone: "(11) 91842-0628", email: "linkxit@gmail.com" },
  { id: 5, nome: "Luiza Cristina", total: "R$ 105,46", telefone: "(11) 91234-5678", email: "luiza@gmail.com" },
]

export default function Clientes() {
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
          <Text style={styles.sectionTitle}>Meus Clientes</Text>
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
            placeholder="Buscar clientes..."
            placeholderTextColor="#aaa"
          />
        </View>

        {clientes.map((cliente) => (
          <View key={cliente.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardNome}>{cliente.nome}</Text>
                <Text style={styles.cardTotal}>Total: {cliente.total}</Text>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Image source={require("../../assets/images/ferramenta-lapis.png")} style={styles.actionIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Image source={require("../../assets/images/lixeira-de-reciclagem.png")} style={styles.actionIcon} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardInfo}>
              <Image source={require("../../assets/images/celular.png")} style={styles.infoIcon} />
              <Text style={styles.cardInfoText}>{cliente.telefone}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Image source={require("../../assets/images/o-email.png")} style={styles.infoIcon} />
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
  cardTotal: { fontSize: 13, color: "#999", marginTop: 2 },
  cardActions: { flexDirection: "row", gap: 8 },
  actionBtn: { padding: 4 },
  actionIcon: { width: 18, height: 18, tintColor: "#FF40A3" },
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