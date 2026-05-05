
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useCarrinho } from "../context/CarrinhoContext"

export default function Carrinho() {
  const router = useRouter()
  const { itens, removerItem, aumentarQuantidade, diminuirQuantidade, totalItens, totalPreco } = useCarrinho()

  const subtotal = parseFloat(totalPreco.replace(",", "."))
  const desconto = subtotal * 0.1
  const total = subtotal - desconto

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <LinearGradient
        colors={["#FF40A3", "#5BBCAA"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.headerBack}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lúmen</Text>
        <TouchableOpacity onPress={() => router.push("/login" as any)}>
          <Image source={require("../../assets/images/do-utilizador.png")} style={styles.headerIcon} />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>

        {/* TÍTULO */}
        <View style={styles.tituloRow}>
          <Text style={styles.titulo}>Carrinho</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalItens} itens</Text>
          </View>
        </View>

        {/* CARRINHO VAZIO */}
        {itens.length === 0 && (
          <View style={styles.vazio}>
            <Image
              source={require("../../assets/images/sacola-de-compras.png")}
              style={styles.vazioIcon}
            />
            <Text style={styles.vazioText}>Seu carrinho está vazio</Text>
            <TouchableOpacity onPress={() => router.push("/")}>
              <LinearGradient
                colors={["#FF40A3", "#5BBCAA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.vazioBtn}
              >
                <Text style={styles.vazioBtnText}>Ver Produtos</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* ITENS */}
        {itens.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={item.image} style={styles.cardImage} resizeMode="contain" />
            <View style={styles.cardInfo}>
              <Text style={styles.cardNome} numberOfLines={2}>{item.nome}</Text>
              <Text style={styles.cardMarca}>{item.marca}</Text>
              <View style={styles.cardBottom}>
                <View style={styles.quantidade}>
                  <TouchableOpacity
                    onPress={() => diminuirQuantidade(item.id)}
                    style={styles.quantBtn}
                  >
                    <Text style={styles.quantBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantNum}>{item.quantidade}</Text>
                  <TouchableOpacity
                    onPress={() => aumentarQuantidade(item.id)}
                    style={styles.quantBtn}
                  >
                    <Text style={styles.quantBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.cardPreco}>
                  R$ {(parseFloat(item.preco.replace("R$ ", "").replace(",", ".")) * item.quantidade).toFixed(2).replace(".", ",")}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => removerItem(item.id)}
            >
              <Image
                source={require("../../assets/images/lixeira-de-reciclagem.png")}
                style={styles.deleteIcon}
              />
            </TouchableOpacity>
          </View>
        ))}

        {/* RESUMO */}
        {itens.length > 0 && (
          <View style={styles.resumo}>
            <Text style={styles.resumoTitulo}>Resumo</Text>
            <View style={styles.resumoRow}>
              <Text style={styles.resumoLabel}>Subtotal</Text>
              <Text style={styles.resumoValor}>R$ {totalPreco}</Text>
            </View>
            <View style={styles.resumoRow}>
              <Text style={styles.resumoLabel}>Desconto (10%)</Text>
              <Text style={styles.resumoDesconto}>- R$ {desconto.toFixed(2).replace(".", ",")}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.resumoRow}>
              <Text style={styles.resumoTotalLabel}>Total</Text>
              <Text style={styles.resumoTotal}>R$ {total.toFixed(2).replace(".", ",")}</Text>
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* BOTÃO FINALIZAR */}
      {itens.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.finalizarBtn}>
            <LinearGradient
              colors={["#FF40A3", "#5BBCAA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.finalizarGradient}
            >
              <Image
                source={require("../../assets/images/cartao-do-banco.png")}
                style={styles.finalizarIcon}
              />
              <Text style={styles.finalizarText}>Finalizar Compra</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

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
  headerBack: { color: "#fff", fontSize: 22, fontWeight: "700" },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  headerIcon: { width: 22, height: 22, tintColor: "#fff" },
  scroll: { flex: 1 },
  tituloRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  titulo: { fontSize: 24, fontWeight: "700", color: "#FF40A3" },
  badge: { backgroundColor: "#FCE4EC", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 12, color: "#FF40A3", fontWeight: "600" },

  // VAZIO
  vazio: { alignItems: "center", paddingTop: 60, gap: 16 },
  vazioIcon: { width: 64, height: 64, tintColor: "#ddd" },
  vazioText: { fontSize: 16, color: "#999" },
  vazioBtn: { borderRadius: 20, paddingHorizontal: 24, paddingVertical: 12 },
  vazioBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  // CARDS
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardImage: { width: 80, height: 80, borderRadius: 10 },
  cardInfo: { flex: 1, paddingHorizontal: 10 },
  cardNome: { fontSize: 13, fontWeight: "600", color: "#333" },
  cardMarca: { fontSize: 11, color: "#999", marginTop: 2 },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  quantidade: { flexDirection: "row", alignItems: "center", gap: 10 },
  quantBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  quantBtnText: { fontSize: 16, color: "#333", fontWeight: "600" },
  quantNum: { fontSize: 14, fontWeight: "700", color: "#333" },
  cardPreco: { fontSize: 14, fontWeight: "700", color: "#FF40A3" },
  deleteBtn: { padding: 4 },
  deleteIcon: { width: 18, height: 18, tintColor: "#FF40A3" },

  // RESUMO
  resumo: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 8,
    padding: 20,
    elevation: 3,
  },
  resumoTitulo: { fontSize: 16, fontWeight: "700", color: "#333", marginBottom: 16 },
  resumoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  resumoLabel: { fontSize: 14, color: "#666" },
  resumoValor: { fontSize: 14, color: "#333", fontWeight: "600" },
  resumoDesconto: { fontSize: 14, color: "#FF40A3", fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 10 },
  resumoTotalLabel: { fontSize: 16, fontWeight: "700", color: "#333" },
  resumoTotal: { fontSize: 16, fontWeight: "700", color: "#FF40A3" },

  // FOOTER
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 28,
    backgroundColor: "#FFF0F5",
  },
  finalizarBtn: { borderRadius: 20 },
  finalizarGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    paddingVertical: 16,
    gap: 10,
  },
  finalizarIcon: { width: 20, height: 20, tintColor: "#fff" },
  finalizarText: { color: "#fff", fontWeight: "700", fontSize: 16 },
})