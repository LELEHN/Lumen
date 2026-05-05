import { useEffect, useState } from "react"
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, ActivityIndicator
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"

const API_URL = "http://192.168.0.183:5010"

type Produto = {
  id: number
  nome: string
  marca: string
  preco: number
  estoque: number
  imagem: string
}

export default function ProdutosAdm() {
  const router = useRouter()
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [filtrados, setFiltrados] = useState<Produto[]>([])
  const [busca, setBusca] = useState("")
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    carregarProdutos()
  }, [])

  // Recarrega ao voltar da tela de adicionar
  useEffect(() => {
    const unsubscribe = router.canGoBack // só pra satisfazer o linter
    carregarProdutos()
  }, [])

  useEffect(() => {
    if (busca.trim() === "") {
      setFiltrados(produtos)
    } else {
      const termo = busca.toLowerCase()
      setFiltrados(
        produtos.filter(p =>
          p.nome.toLowerCase().includes(termo) ||
          p.marca.toLowerCase().includes(termo)
        )
      )
    }
  }, [busca, produtos])

  async function carregarProdutos() {
    try {
      setLoading(true)
      const resp = await fetch(`${API_URL}/produto`)
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.erro || "Erro ao buscar produtos")
      setProdutos(data.produtos)
      setFiltrados(data.produtos)
    } catch (err: any) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function deletarProduto(id: number) {
    try {
      const token = await AsyncStorage.getItem("token")
      const resp = await fetch(`${API_URL}/adm/produto/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (!resp.ok) throw new Error("Erro ao deletar")
      // Remove da lista localmente
      setProdutos(prev => prev.filter(p => p.id !== id))
    } catch (err: any) {
      console.error(err.message)
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
          <Text style={styles.sectionTitle}>Meus Produtos</Text>
          <TouchableOpacity onPress={() => router.push("/adicionar-produto" as any)}>
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
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        {loading && <ActivityIndicator color="#FF40A3" style={{ marginTop: 24 }} />}
        {erro !== "" && <Text style={styles.erroText}>{erro}</Text>}
        {!loading && filtrados.length === 0 && (
          <Text style={styles.vazioText}>Nenhum produto encontrado.</Text>
        )}

        <View style={styles.grid}>
          {filtrados.map((produto) => (
            <View key={produto.id} style={styles.card}>
              <Image
                source={{ uri: `${API_URL}/storage/imagemProduto/${produto.imagem}` }}
                style={styles.cardImage}
                resizeMode="contain"
              />

              {/* badge de estoque */}
              <View style={[
                styles.estoqueBadge,
                produto.estoque <= 5 && { backgroundColor: "#FFE0E0" }
              ]}>
                <Text style={[
                  styles.estoqueText,
                  produto.estoque <= 5 && { color: "#E53935" }
                ]}>
                  Estoque: {produto.estoque}
                </Text>
              </View>

              <Text style={styles.cardNome} numberOfLines={2}>{produto.nome}</Text>
              <Text style={styles.cardMarca}>{produto.marca}</Text>
              <Text style={styles.cardPreco}>R$ {parseFloat(String(produto.preco)).toFixed(2)}</Text>

              {/* ações */}
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => router.push(`/editar-produto/${produto.id}` as any)}
                >
                  <Text style={styles.actionBtnText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionBtnDelete]}
                  onPress={() => deletarProduto(produto.id)}
                >
                  <Text style={styles.actionBtnText}>🗑️</Text>
                </TouchableOpacity>
              </View>
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
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16,
  },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  headerIcon: { color: "#fff", fontSize: 20, fontWeight: "700" },
  scroll: { flex: 1 },
  sectionHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12,
  },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#FF40A3" },
  addBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center" },
  addBtnText: { color: "#fff", fontSize: 22, fontWeight: "700", lineHeight: 24 },
  searchContainer: { paddingHorizontal: 16, marginBottom: 12 },
  searchInput: {
    backgroundColor: "#fff", borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 14, color: "#333", elevation: 2,
  },
  erroText: { color: "red", textAlign: "center", marginTop: 16 },
  vazioText: { color: "#999", textAlign: "center", marginTop: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, gap: 12 },
  card: {
    width: "47%", backgroundColor: "#fff", borderRadius: 12, padding: 10,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  cardImage: { width: "100%", height: 120, marginBottom: 8, borderRadius: 8 },
  estoqueBadge: {
    backgroundColor: "#F0FFF4", borderRadius: 8,
    paddingHorizontal: 6, paddingVertical: 2, alignSelf: "flex-start", marginBottom: 6,
  },
  estoqueText: { fontSize: 10, fontWeight: "700", color: "#2E7D32" },
  cardNome: { fontSize: 12, fontWeight: "600", color: "#333", minHeight: 32 },
  cardMarca: { fontSize: 11, color: "#999", marginTop: 2 },
  cardPreco: { fontSize: 14, fontWeight: "700", color: "#FF40A3", marginTop: 4, marginBottom: 2 },
  cardActions: { flexDirection: "row", gap: 6, marginTop: 8 },
  actionBtn: {
    flex: 1, backgroundColor: "#FFF0F5", borderRadius: 8,
    paddingVertical: 6, alignItems: "center",
  },
  actionBtnDelete: { backgroundColor: "#FFF0F0" },
  actionBtnText: { fontSize: 14 },
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