// src/app/produto/[id].tsx

import { LinearGradient } from "expo-linear-gradient"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useCarrinho } from "../../context/CarrinhoContext"
import { apiFetch } from "../../services/api"

const BASE_URL = "http://192.168.15.9:5010"

type Produto = {
  id: number
  nome: string
  marca: string
  preco: number
  descricao: string
  imagem: string
  estoque: number
}

export default function DetalhesProduto() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const [quantidade, setQuantidade] = useState(1)
  const [produto, setProduto] = useState<Produto | null>(null)
  const [loading, setLoading] = useState(true)
  const { adicionarItem } = useCarrinho()

  useEffect(() => {
    async function carregarProduto() {
      try {
        const data = await apiFetch(`/produto/${id}`)
        setProduto(data.produto)
      } catch (err) {
        console.log("Erro ao carregar produto:", err)
      } finally {
        setLoading(false)
      }
    }

    carregarProduto()
  }, [id])

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF40A3" />
      </View>
    )
  }

  if (!produto) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Produto não encontrado.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.notFoundLink}>Voltar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const imagemUri = `${BASE_URL}/storage/imagemProduto/${produto.imagem}`

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
        <Text style={styles.headerTitle}>Detalhes do Produto</Text>
        <TouchableOpacity>
          <Image
            source={require("../../../assets/images/coracao.png")}
            style={styles.headerHeart}
          />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>

        {/* IMAGEM */}
        <View style={styles.imagemContainer}>
          <Image
            source={{ uri: imagemUri }}
            style={styles.imagemPrincipal}
            resizeMode="contain"
          />
        </View>

        {/* CARD INFO */}
        <View style={styles.card}>

          {/* NOME E PREÇO */}
          <View style={styles.nomePreco}>
            <Text style={styles.nome}>{produto.nome}</Text>
            <Text style={styles.preco}>
              R$ {parseFloat(String(produto.preco)).toFixed(2).replace(".", ",")}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* GRID DE ATRIBUTOS */}
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Marca</Text>
              <Text style={styles.gridValue}>{produto.marca}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Estoque</Text>
              <Text style={styles.gridValue}>{produto.estoque} unidades</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* DETALHES */}
          <Text style={styles.detalhesTitle}>Descrição</Text>
          <Text style={styles.detalhesText}>{produto.descricao}</Text>

        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* FOOTER FIXO */}
      <View style={styles.footer}>
        <View style={styles.quantidade}>
          <TouchableOpacity
            onPress={() => setQuantidade((q) => Math.max(1, q - 1))}
            style={styles.quantBtn}
          >
            <Text style={styles.quantBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantNum}>{quantidade}</Text>
          <TouchableOpacity
            onPress={() => setQuantidade((q) => q + 1)}
            style={styles.quantBtn}
          >
            <Text style={styles.quantBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.btnSacola}
          onPress={() => {
            adicionarItem({
              id: produto.id,
              nome: produto.nome,
              marca: produto.marca,
              preco: `R$ ${parseFloat(String(produto.preco)).toFixed(2).replace(".", ",")}`,
              image: { uri: imagemUri },
            })
            router.push("/carrinho" as any)
          }}
        >
          <LinearGradient
            colors={["#FF40A3", "#5BBCAA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btnSacolaGradient}
          >
            <Image
              source={require("../../../assets/images/sacola-de-compras.png")}
              style={styles.btnSacolaIcone}
            />
            <Text style={styles.btnSacolaText}>Adicionar à Sacola</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  notFound: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  notFoundText: { fontSize: 16, color: "#666" },
  notFoundLink: { fontSize: 14, color: "#FF40A3", fontWeight: "700" },
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
  headerHeart: { width: 22, height: 22, tintColor: "#fff" },
  imagemContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  imagemPrincipal: { width: "100%", height: "100%" },
  scroll: { flex: 1 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: -20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  nomePreco: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 8,
  },
  nome: { fontSize: 16, fontWeight: "600", color: "#333", flex: 1 },
  preco: { fontSize: 22, fontWeight: "800", color: "#FF40A3" },
  divider: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  gridItem: { width: "50%", marginBottom: 16 },
  gridLabel: { fontSize: 14, fontWeight: "700", color: "#333" },
  gridValue: { fontSize: 13, color: "#888", marginTop: 2 },
  detalhesTitle: { fontSize: 14, fontWeight: "700", color: "#FF40A3", marginBottom: 8 },
  detalhesText: { fontSize: 13, color: "#666", lineHeight: 20 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 28,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    gap: 16,
  },
  quantidade: { flexDirection: "row", alignItems: "center", gap: 12 },
  quantBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  quantBtnText: { fontSize: 18, color: "#333", fontWeight: "600" },
  quantNum: { fontSize: 16, fontWeight: "700", color: "#333" },
  btnSacola: { flex: 1 },
  btnSacolaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    paddingVertical: 14,
    gap: 8,
  },
  btnSacolaIcone: { width: 20, height: 20, tintColor: "#fff" },
  btnSacolaText: { color: "#fff", fontWeight: "700", fontSize: 15 },
})