// src/app/perfil.tsx

import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, Modal, TextInput
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useState, useEffect } from "react"
import * as ImagePicker from "expo-image-picker"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getMeuPerfil, uploadFotoPerfil, atualizarInfoPerfil, buscarMinhasVendas } from "../services/usuarioService"

const getStatusStyle = (status: string) => {
  if (status === "pago") return styles.badgeGreen
  if (status === "em andamento") return styles.badgeBlue
  return styles.badgeYellow
}
const getStatusText = (status: string) => {
  if (status === "pago") return "Pago"
  if (status === "em andamento") return "Em andamento"
  return "Pendente"
}
const getStatusTextStyle = (status: string) => {
  if (status === "pago") return styles.badgeTextGreen
  if (status === "em andamento") return styles.badgeTextBlue
  return styles.badgeTextYellow
}

export default function Perfil() {
  const router = useRouter()
  const [abaAtiva, setAbaAtiva] = useState<"info" | "pedidos">("info")
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null)
  const [loadingFoto, setLoadingFoto] = useState(false)
  const [loadingPedidos, setLoadingPedidos] = useState(false)
  const [pedidos, setPedidos] = useState<any[]>([])
  const [cliente, setCliente] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    membro: "Cliente desde Janeiro 2024",
  })
  const [modalVisivel, setModalVisivel] = useState(false)
  const [editNome, setEditNome] = useState("")
  const [editTelefone, setEditTelefone] = useState("")
  const [editEndereco, setEditEndereco] = useState("")
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    async function carregarDados() {
      try {
        const dados = await getMeuPerfil()
        setCliente({
          nome: dados.nome || "",
          email: dados.email || "",
          telefone: dados.telefone || "",
          endereco: dados.endereco || "",
          membro: "Cliente desde Janeiro 2024",
        })
        if (dados.foto) setFotoPerfil(dados.foto)
      } catch (err) {
        console.log("Erro ao carregar perfil:", err)
      }

      try {
        setLoadingPedidos(true)
        const resp = await buscarMinhasVendas()
        setPedidos(resp.vendas)
      } catch (err) {
        console.log("Erro ao carregar pedidos:", err)
      } finally {
        setLoadingPedidos(false)
      }
    }

    carregarDados()
  }, [])

  async function escolherFoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Precisamos de acesso à sua galeria para trocar a foto.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
      base64: true,
    })

    if (!result.canceled) {
      const asset = result.assets[0]
      setLoadingFoto(true)
      try {
        const fotoBase64 = `data:image/jpeg;base64,${asset.base64}`
        await uploadFotoPerfil(fotoBase64)
        setFotoPerfil(fotoBase64)
        Alert.alert("Sucesso", "Foto atualizada!")
      } catch (err) {
        Alert.alert("Erro", "Não foi possível salvar a foto.")
        console.log(err)
      } finally {
        setLoadingFoto(false)
      }
    }
  }

  function abrirModal() {
    setEditNome(cliente.nome)
    setEditTelefone(cliente.telefone)
    setEditEndereco(cliente.endereco)
    setModalVisivel(true)
  }

  async function salvarEdicao() {
    if (!editNome.trim()) {
      Alert.alert("Atenção", "Nome é obrigatório")
      return
    }
    setSalvando(true)
    try {
      await atualizarInfoPerfil(editNome, editTelefone, editEndereco)
      setCliente(prev => ({ ...prev, nome: editNome, telefone: editTelefone, endereco: editEndereco }))
      setModalVisivel(false)
      Alert.alert("Sucesso", "Informações atualizadas!")
    } catch (err) {
      Alert.alert("Erro", "Não foi possível salvar.")
    } finally {
      setSalvando(false)
    }
  }

  async function handleSair() {
    const isWeb = typeof window !== "undefined" && typeof window.confirm === "function"

    if (isWeb) {
      const confirmar = window.confirm("Deseja sair da sua conta?")
      if (confirmar) {
        await AsyncStorage.clear()
        router.replace("/login" as any)
      }
    } else {
      Alert.alert(
        "Sair da conta",
        "Deseja sair da sua conta?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Sair",
            style: "destructive",
            onPress: async () => {
              await AsyncStorage.clear()
              router.replace("/login" as any)
            }
          }
        ]
      )
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
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.brandName}>Lúmen</Text>
            <Text style={styles.brandSub}>O Boticário & Eudora</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => router.push("/")}
            >
              <Image
                source={require("../../assets/images/silhueta-de-icone-de-casa.png")}
                style={styles.headerIconImg}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.profileCard}>
          <Text style={styles.profileLabel}>Meu Perfil</Text>
          <Text style={styles.profileSince}>{cliente.membro}</Text>
          <View style={styles.profileRow}>
            <TouchableOpacity onPress={escolherFoto} style={styles.avatarWrapper} disabled={loadingFoto}>
              {loadingFoto ? (
                <View style={styles.avatar}>
                  <ActivityIndicator color="#FF40A3" />
                </View>
              ) : fotoPerfil ? (
                <Image source={{ uri: fotoPerfil }} style={styles.avatarFoto} />
              ) : (
                <View style={styles.avatar}>
                  <Image
                    source={require("../../assets/images/do-utilizador.png")}
                    style={styles.avatarIcon}
                  />
                </View>
              )}
              <View style={styles.avatarEditBadge}>
                <Image
                  source={require("../../assets/images/ferramenta-lapis.png")}
                  style={styles.avatarEditIcon}
                />
              </View>
            </TouchableOpacity>

            <View>
              <Text style={styles.profileName}>{cliente.nome}</Text>
              <Text style={styles.profileEmail}>{cliente.email}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, abaAtiva === "info" && styles.tabActive]}
          onPress={() => setAbaAtiva("info")}
        >
          <Text style={[styles.tabText, abaAtiva === "info" && styles.tabTextActive]}>
            Minhas Informações
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, abaAtiva === "pedidos" && styles.tabActive]}
          onPress={() => setAbaAtiva("pedidos")}
        >
          <Text style={[styles.tabText, abaAtiva === "pedidos" && styles.tabTextActive]}>
            Meus Pedidos
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>

        {abaAtiva === "info" && (
          <View style={styles.content}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Informações Pessoais</Text>
              <TouchableOpacity onPress={abrirModal}>
                <Image
                  source={require("../../assets/images/ferramenta-lapis.png")}
                  style={styles.editIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}>
                  <Image source={require("../../assets/images/do-utilizador.png")} style={styles.infoIconImg} />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Nome Completo</Text>
                  <Text style={styles.infoValue}>{cliente.nome}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}>
                  <Image source={require("../../assets/images/mais.png")} style={styles.infoIconImg} />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{cliente.email}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}>
                  <Image source={require("../../assets/images/celular.png")} style={styles.infoIconImg} />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Telefone</Text>
                  <Text style={styles.infoValue}>{cliente.telefone || "Não informado"}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}>
                  <Image source={require("../../assets/images/caminhao-de-entrega.png")} style={styles.infoIconImg} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Endereço de Entrega</Text>
                  <Text style={styles.infoValue}>{cliente.endereco || "Não informado"}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.sairBtn} onPress={handleSair}>
              <Text style={styles.sairBtnText}>Sair da conta</Text>
            </TouchableOpacity>
          </View>
        )}

        {abaAtiva === "pedidos" && (
          <View style={styles.content}>
            {loadingPedidos ? (
              <ActivityIndicator color="#FF40A3" style={{ marginTop: 40 }} />
            ) : pedidos.length === 0 ? (
              <Text style={{ textAlign: "center", color: "#999", marginTop: 40 }}>
                Você ainda não fez nenhum pedido.
              </Text>
            ) : (
              pedidos.map((pedido) => (
                <View key={pedido.id} style={styles.pedidoCard}>
                  <View style={styles.pedidoHeader}>
                    <View>
                      <Text style={styles.pedidoId}>Pedido #{pedido.id}</Text>
                      <Text style={styles.pedidoData}>
                        {new Date(pedido.data_venda).toLocaleDateString("pt-BR")}
                      </Text>
                    </View>
                    <View style={getStatusStyle(pedido.status)}>
                      <Text style={getStatusTextStyle(pedido.status)}>
                        {getStatusText(pedido.status)}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.pedidoValor}>
                    R$ {parseFloat(pedido.valor_total).toFixed(2).replace(".", ",")}
                  </Text>
                </View>
              ))
            )}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* MODAL DE EDIÇÃO */}
      <Modal visible={modalVisivel} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitulo}>Editar Informações</Text>

            <Text style={styles.modalLabel}>Nome</Text>
            <TextInput
              style={styles.modalInput}
              value={editNome}
              onChangeText={setEditNome}
              placeholder="Seu nome"
            />

            <Text style={styles.modalLabel}>Telefone</Text>
            <TextInput
              style={styles.modalInput}
              value={editTelefone}
              onChangeText={setEditTelefone}
              placeholder="(11) 99999-9999"
              keyboardType="phone-pad"
            />

            <Text style={styles.modalLabel}>Endereço de Entrega</Text>
            <TextInput
              style={[styles.modalInput, { height: 70 }]}
              value={editEndereco}
              onChangeText={setEditEndereco}
              placeholder="Rua, número - Bairro, Cidade - UF"
              multiline
            />

            <TouchableOpacity
              style={styles.modalBtnSalvar}
              onPress={salvarEdicao}
              disabled={salvando}
            >
              {salvando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.modalBtnSalvarText}>Salvar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalBtnCancelar}
              onPress={() => setModalVisivel(false)}
            >
              <Text style={styles.modalBtnCancelarText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF0F5" },
  header: { paddingHorizontal: 16, paddingTop: 52, paddingBottom: 16 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 },
  brandName: { color: "#fff", fontSize: 18, fontWeight: "700" },
  brandSub: { color: "rgba(255,255,255,0.85)", fontSize: 11 },
  headerIcons: { flexDirection: "row", gap: 10, alignItems: "center" },
  headerIconBtn: { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 20, padding: 8 },
  headerIconImg: { width: 18, height: 18, tintColor: "#fff" },
  profileCard: { backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 14, padding: 14 },
  profileLabel: { color: "#fff", fontSize: 12, fontWeight: "600" },
  profileSince: { color: "rgba(255,255,255,0.75)", fontSize: 10, marginBottom: 10 },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarWrapper: { position: "relative" },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.25)", justifyContent: "center", alignItems: "center" },
  avatarFoto: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: "#fff" },
  avatarIcon: { width: 24, height: 24, tintColor: "#fff" },
  avatarEditBadge: { position: "absolute", bottom: -2, right: -2, backgroundColor: "#fff", borderRadius: 10, width: 20, height: 20, justifyContent: "center", alignItems: "center", elevation: 2 },
  avatarEditIcon: { width: 10, height: 10, tintColor: "#FF40A3" },
  profileName: { color: "#fff", fontSize: 15, fontWeight: "700" },
  profileEmail: { color: "rgba(255,255,255,0.8)", fontSize: 12 },
  tabs: { flexDirection: "row", backgroundColor: "#fff", borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  tab: { flex: 1, paddingVertical: 13, alignItems: "center", borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabActive: { borderBottomColor: "#FF40A3" },
  tabText: { fontSize: 13, color: "#999" },
  tabTextActive: { color: "#FF40A3", fontWeight: "600" },
  scroll: { flex: 1 },
  content: { padding: 16 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#FF40A3" },
  editIcon: { width: 18, height: 18, tintColor: "#FF40A3" },
  infoCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, elevation: 2 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8 },
  infoIconBox: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#FDF0F5", justifyContent: "center", alignItems: "center", flexShrink: 0 },
  infoIconImg: { width: 16, height: 16, tintColor: "#FF40A3" },
  infoLabel: { fontSize: 11, color: "#999" },
  infoValue: { fontSize: 13, fontWeight: "600", color: "#333", flexShrink: 1 },
  divider: { height: 0.5, backgroundColor: "#f0f0f0", marginVertical: 4 },
  sairBtn: { marginTop: 20, borderWidth: 1.5, borderColor: "#FF40A3", borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  sairBtnText: { color: "#FF40A3", fontWeight: "700", fontSize: 14 },
  pedidoCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 },
  pedidoHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  pedidoId: { fontSize: 14, fontWeight: "700", color: "#333" },
  pedidoData: { fontSize: 11, color: "#FF40A3", marginTop: 2 },
  pedidoValor: { fontSize: 20, fontWeight: "700", color: "#FF40A3", marginBottom: 12 },
  badgeGreen: { backgroundColor: "#E1F5EE", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeBlue: { backgroundColor: "#E6F1FB", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeYellow: { backgroundColor: "#FFF3E0", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeTextGreen: { fontSize: 11, fontWeight: "600", color: "#0F6E56" },
  badgeTextBlue: { fontSize: 11, fontWeight: "600", color: "#185FA5" },
  badgeTextYellow: { fontSize: 11, fontWeight: "600", color: "#854F0B" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", padding: 24 },
  modalCard: { backgroundColor: "#fff", borderRadius: 20, padding: 24 },
  modalTitulo: { fontSize: 17, fontWeight: "700", color: "#FF40A3", marginBottom: 16, textAlign: "center" },
  modalLabel: { fontSize: 12, color: "#999", marginBottom: 4, marginTop: 12 },
  modalInput: { borderWidth: 1, borderColor: "#eee", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: "#333" },
  modalBtnSalvar: { marginTop: 20, backgroundColor: "#FF40A3", borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  modalBtnSalvarText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  modalBtnCancelar: { marginTop: 10, paddingVertical: 10, alignItems: "center" },
  modalBtnCancelarText: { color: "#999", fontSize: 14 },
})